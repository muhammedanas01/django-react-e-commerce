from django.contrib import admin
from userauths.models import User, Profile


class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'full_name', 'email', 'phone_number',]
    search_fields = ['full_name']

class ProfileAdmin(admin.ModelAdmin):
    list_display = [ 'user','full_name', 'country', 'state', 'city']
    search_fields = ['full_name']
    list_filter = ['date']



# Register your models here.
admin.site.register(User,UserAdmin)
admin.site.register(Profile,ProfileAdmin)