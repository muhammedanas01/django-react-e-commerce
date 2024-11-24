from django.db import models
from django.utils.text import slugify

from userauths.models import User, Profile
# Create your models here.

class Vendor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) # one user one vendor 
    image = models.FileField(upload_to="vendor", blank=True, default="vendor.jpg"),# shop avatar or image
    name = models.CharField(max_length=200, help_text="Shop Name", null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    mobile = models.CharField(max_length=200, help_text="shop mobile number", null=False, blank=False)
    active = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(unique=True, max_length=500)

    class Meta:
        verbose_name_plural = "vendors"
        ordering = ['-date']

    def __str__(self):
        return str(self.name)
    #over rides default save method
    def save(self, *args, **kwargs):
        if self.slug == "" or self.slug == None:
            self.slug == slugify(self.name)

        super(Vendor, self).save( *args, **kwargs)# ensures that the model instance is saved

    