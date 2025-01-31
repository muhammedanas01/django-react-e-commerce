from rest_framework import serializers

from userauths.models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    #image = serializers.ImageField(required=False)  # Ensure image field is handled
    #Specifies the model that should be serialized
    class Meta:
        model = Profile
        fields = "__all__"
        depth = 1

