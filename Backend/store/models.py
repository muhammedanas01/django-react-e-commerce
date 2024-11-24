from django.db import models
from django.utils.text import slugify

from vendor.models import Vendor
from userauths.models import User, Profile

from shortuuid.django_fields import ShortUUIDField


STATUS = (
    ("draft","Draft"),
    ("disabled","Disabled"),
    ("in_review","In Review"),
    ("published","Published"),

)

class Category(models.Model):
    title =  models.CharField(max_length=100)
    image = models.FileField(upload_to="category", default="category.jpg", null=True,)
    active = models.BooleanField(default=True)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = "Category"
        ordering = ['-title']   

    def __str__(self):
        return self.title
    
class Product(models.Model):
    title = models.CharField(max_length=100)
    image = models.FileField(upload_to="category", default="product.jpg", null=True,)
    description = models.TextField(null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)# under which category this product comes
    price = models.DecimalField(decimal_places=2, max_digits=12, default=0.00) # for price
    old_price = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    shipping_amount = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)

    stock_quantity = models.PositiveIntegerField(default=1) # vendor must have atleast one item in quantity
    in_stock = models.BooleanField(default=True)

    status = models.CharField(max_length=100, choices=STATUS, default="published")
    featured = models.BooleanField(default=False)
    views = models.PositiveIntegerField(default=0)
    rating  = models.PositiveIntegerField(default=0)

    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE) #many to-one relationship. one vendor can have many products 

    product_id  = ShortUUIDField(unique=True, length=10, prefix="PROD", alphabet="1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    slug = models.SlugField(unique=True)

    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Products"
        ordering = ['-title']   

    def __str__(self):
        return str(self.title)

    #over rides default save method
    def save(self, *args, **kwargs):
        if self.slug == "" or self.slug == None:
            self.slug == slugify(self.title)

        super(Product, self).save( *args, **kwargs)# ensures that the model instance is saved







