from rest_framework import serializers
from api.models import Post, Code, UserProfile, TeacherInfo



class CodeSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=6)
    chat_id = serializers.CharField(max_length=100)
    telegram_username = serializers.CharField(max_length=50)
    is_valid = serializers.BooleanField(required=False)

    def create(self, validated_data):
        code = Code.objects.create(
            code = validated_data.get('code'),
            chat_id = validated_data.get('chat_id'),
            telegram_username = validated_data.get('telegram_username'),
            is_valid = False
        )
        return code

    def update(self, instance, validated_data):
        instance.code = validated_data.get('code')
        instance.chat_id = validated_data.get('chat_id')
        instance.telegram_username = validated_data.get('telegram_username')
        instance.is_valid = True
        instance.save()
        return instance

# class UserProfileSerializer(serializers.Serializer):
#     name = serializers.CharField(max_length=40)
#     telegram_chat_id = serializers.CharField(max_length=100)
#     telegram_username = serializers.CharField(max_length=100)
#     profile_photo = serializers.CharField(max_length = 200)
#     faculty = serializers.CharField(max_length=50)
#     gender = serializers.CharField(max_length=50)
#     year_of_study = serializers.IntegerField(default=0)

class UserProfileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    user = serializers.CharField(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'name', 'telegram_username', 'profile_photo', 'faculty', 'gender', 'year_of_study']


class TeacherSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = TeacherInfo
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer()
    class Meta:
        model = Post
        fields = '__all__'