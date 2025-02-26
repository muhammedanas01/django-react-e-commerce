from django.db import models
from django.utils.text import slugify
from django.dispatch import receiver
from django.db.models.signals import post_save
from vendor.models import Vendor
from userauths.models import User, Profile

from shortuuid.django_fields import ShortUUIDField

# choices
STATUS = (
    ("draft", "Draft"),
    ("disabled", "Disabled"),
    ("in_review", "In Review"),
    ("published", "Published"),
)
# choices
PAYMENT_STATUS = (
    ("pending", "Pending"),
    ("paid", "Paid"),
    ("processing", "Processing"),
    ("cancelled", "Cancelled"),
    ("Deliverd", "deliverd"),
)

# choices
ORDER_STATUS = (
    ("pending", "Pending"),
    ("processing", "Processing"),
    ("cancelled", "Cancelled"),
    ("successfull", "Successfull"),
    ("order confirmed", "Order Confirmed")
)

# review choices
RATING = (
    (1, "1 Star"),
    (2, "2 Star"),
    (3, "3 Star"),
    (4, "4 Star"),
    (5, "5 Star"),
)


class Category(models.Model):
    title = models.CharField(max_length=100)
    image = models.FileField(
        upload_to="category",
        default="category.jpg",
        null=True,
    )
    active = models.BooleanField(default=True)
    slug = models.SlugField(unique=True)

    # Defines the plural name for the model. It is used in the Django admin interface.
    # We can set it to any meaningful name we want, and it will be used as the plural representation of the table.
    class Meta:
        verbose_name_plural = "Category"
        ordering = ["-title"]

    def __str__(self):
        return self.title


class Product(models.Model):
    title = models.CharField(max_length=100)
    image = models.FileField(
        upload_to="category",
        default="product.jpg",
        null=True,
    )
    description = models.TextField(null=True, blank=True)  # under which category this product comes
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    price = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)  # for price
    old_price = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    shipping_amount = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    stock_quantity = models.PositiveIntegerField(default=1)  # vendor must have atleast one item in quantity
    in_stock = models.BooleanField(default=True)

    status = models.CharField(max_length=100, choices=STATUS, default="published")
    featured = models.BooleanField(default=False)
    views = models.PositiveIntegerField(default=0)
    rating = models.PositiveIntegerField(default=0, null=True, blank=True)

    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)  # relationship. one vendor can have many products

    product_id = ShortUUIDField(
        unique=True,
        length=10,
        prefix="PROD",
        alphabet="1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    )
    slug = models.SlugField(null=True, blank=True)

    date = models.DateTimeField(auto_now_add=True)

    # Defines the plural name for the model. It is used in the Django admin interface.
    # We can set it to any meaningful name we want, and it will be used as the plural representation of the table.
    class Meta:
        verbose_name_plural = "Products"
        ordering = ["-title"]

    # string representation of this model
    def __str__(self):
        return str(self.title)

    # This filters the Review model to get all reviews related to the current product instance(self)
    # aggregates the filtered reviews to calculate the average rating, returns a dictionary
    def product_rating(self):
        product_rating = Review.objects.filter(product=self).aggregate(avg_rating=models.Avg("rating"))
        return product_rating["avg_rating"] or 0  # returns 0 when there are no reviews

    def rating_count(self):
        return Review.objects.filter(product=self).count()

    # this method is for to get all gallery,specification,size,color of a product which is inline to it.
    def gallery(self):
        return Gallery.objects.filter(product=self)

    def specification(self):
        return Specification.objects.filter(product=self)

    def size(self):
        return Size.objects.filter(product=self)

    def color(self):
        return Color.objects.filter(product=self)
    
    def orders(self):
        return CartOrderItem.objects.filter(product=self).count()

    # over rides default save method
    def save(self, *args, **kwargs):
        if self.slug == "" or self.slug == None:
            self.slug = slugify(self.title)

        self.rating = self.product_rating()

        super(Product, self).save(*args, **kwargs)  # ensures that the model instance is saved


class Gallery(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    image = models.FileField(
        upload_to="products",
        default="product.jpg",
        blank=True,
        null=True
    )
    active = models.BooleanField(default=True)
    date = models.DateTimeField(auto_now_add=True)
    gallery_id = ShortUUIDField(unique=True, length=10, alphabet="1234567890abcdefghijklmnopqrstuvwxyz")

    def __str__(self):
        return str(self.product.title)

    # Defines the plural name for the model. It is used in the Django admin interface.
    # We can set it to any meaningful name we want, and it will be used as the plural representation of the table.
    class Meta:
        verbose_name_plural = "Product Images"


class Specification(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=1000, null=True, blank=True)
    content = models.CharField(max_length=1000, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.title)

    # Defines the plural name for the model. It is used in the Django admin interface.
    # We can set it to any meaningful name we want, and it will be used as the plural representation of the table.
    class Meta:
        verbose_name_plural = "Specification"


# same products with diffrent size may be having diffrent price so this is to give appropriate size for appropriate product.
class Size(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=1000, null=True, blank=True)
    price = models.DecimalField(decimal_places=2, max_digits=12, default=0.00, null=True, blank=True)  # for price
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.name)

    # Defines the plural name for the model. It is used in the Django admin interface.
    # We can set it to any meaningful name we want, and it will be used as the plural representation of the table.
    class Meta:
        verbose_name_plural = "Size"


class Color(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=1000, null=True, blank=True)
    color_code = models.CharField(max_length=100, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.name)

    # Defines the plural name for the model. It is used in the Django admin interface.
    # We can set it to any meaningful name we want, and it will be used as the plural representation of the table.
    class Meta:
        verbose_name_plural = "Color"


# Represents individual items added to a shopping cart by a user.
# Represents items that a user is currently considering for purchase but has not yet ordered
class Cart(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    item_quantity = models.PositiveIntegerField(default=0)
    price = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)
    sub_total = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)
    shipping_amount = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)
    service_fee = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)
    tax = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)
    total = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)
    country = models.CharField(max_length=100, null=True, blank=True)
    size = models.CharField(max_length=100, null=True, blank=True)
    color = models.CharField(max_length=100, null=True, blank=True)
    cart_id = models.CharField(max_length=100, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.cart_id} - {self.product.title}"


# Represents an order made by a user, which can contain multiple products and is linked to multiple vendors.
# When the user decides to checkout and places an order, the items from the cart are converted into an order.
# Store's overall details of an entire order
class CartOrder(models.Model):
    vendor = models.ManyToManyField(Vendor, blank=True,)  # indicating which vendors are involved in the order.
    buyer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    sub_total = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)
    shipping_amount = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)
    service_fee = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)
    tax = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)
    total = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)  # grand total

    payment_status = models.CharField(choices=PAYMENT_STATUS, max_length=100, default="pending")
    order_status = models.CharField(choices=ORDER_STATUS, max_length=100, default="pending")

    # coupen # initial total amount is total bill amount to reduce coupen discount from it
    initial_total = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)
    saved = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)

    # personal info
    full_name = models.CharField(max_length=100, null=True, blank=True)
    email = models.CharField(max_length=100, null=True, blank=True)
    mobile = models.CharField(max_length=100, null=True, blank=True)
    additional_mobile = models.CharField(max_length=100, null=True, blank=True)

    # shipping adress
    address = models.CharField(max_length=100, null=True, blank=True)
    landmark = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    postal_code = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)

    order_id = ShortUUIDField(unique=True, length=10, alphabet="1234567890hjdsuwyeodnb")
    stripe_session_id = models.CharField(max_length=1000, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.order_id)
    
    def orderItem(self): # retrieves all CartOrderItem objects associated with a specific CartOrder
        return CartOrderItem.objects.filter(order=self)

class Coupon(models.Model):
    user_by = models.ManyToManyField(User, blank=True)  # to associate multiple users with a single coupon and and each user can use multiple coupons.
    vendor = models.ForeignKey(Vendor, models.CASCADE)
    code = models.CharField(max_length=1000)
    discount = models.IntegerField(default=1)
    seen = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code


# represents each individual item that is part of the overall entire CartOrder
# Represents each product within the CartOrder, detailing the specifics of each item (such as quantity, price, vendor, etc.)
class CartOrderItem(models.Model):
    order = models.ForeignKey(CartOrder, on_delete=models.CASCADE) #ensures that each CartOrderItem belongs to a specific order 
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)

    item_quantity = models.PositiveIntegerField(default=0)
    price = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)
    sub_total = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)
    shipping_amount = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)
    service_fee = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)
    tax = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)
    total = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)
    country = models.CharField(max_length=100, null=True, blank=True)
    size = models.CharField(max_length=100, null=True, blank=True)
    color = models.CharField(max_length=100, null=True, blank=True)

    coupon = models.ManyToManyField(Coupon, blank=True)
    initial_total = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)
    saved = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)

    oid = ShortUUIDField(unique=True, length=10, alphabet="1234567890hjdsuwyeodnb")
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.oid)


# This model allows users to ask questions about specific products and have those questions answered.
class ProductFaq(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    email = models.EmailField(null=True, blank=True)
    question = models.CharField(max_length=1000)
    answer = models.TextField(null=True, blank=True)
    active = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question

    # Defines the plural name for the model. It is used in the Django admin interface.
    # We can set it to any meaningful name we want, and it will be used as the plural representation of the table.
    class Meta:
        verbose_name_plural = "Product FaQs"


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    review = models.TextField(null=True, blank=True)
    rating = models.IntegerField(default=None, choices=RATING)
    active = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.product.title

    # Defines the plural name for the model. It is used in the Django admin interface.
    # We can set it to any meaningful name we want, and it will be used as the plural representation of the table.
    class Meta:
        verbose_name_plural = "Product Review"

    # to access the profile of the user who wrote the review
    def profile(self):
        return Profile.objects.get(user=self.user)


# when review is saved it will trigger the update_product_rating
@receiver(post_save, sender=Review)
def update_product_rating(sender, instance, **kwargs):
    if instance.product:
        instance.product.save()


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.product.title

    class Meta:
        verbose_name_plural = "Wishlist"


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    order = models.ForeignKey(CartOrder, on_delete=models.SET_NULL, null=True, blank=True)
    vendor = models.ForeignKey(Vendor,  on_delete=models.SET_NULL, null=True, blank=True)
    order_item = models.ForeignKey(CartOrderItem, on_delete=models.SET_NULL, null=True, blank=True)
    seen = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.order:
            return self.order.order_id
        else:
            return f"Notification - {self.pk}"


class Tax(models.Model):
    country = models.CharField(max_length=100)
    rate = models.IntegerField(default=5, help_text="numbers here added are consider as percentage. eg:5%")
    active = models.BooleanField(default=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.country

    class Meta:
        verbose_name_plural = "Tax"
        ordering = ["country"]  # displays in alphabetical order
