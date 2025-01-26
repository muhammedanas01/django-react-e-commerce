from rest_framework import serializers

from userauths.models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    #Specifies the model that should be serialized
    class Meta:
        model = Profile
        fields = "__all__"
        depth = 1