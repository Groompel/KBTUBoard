from rest_framework import serializers


from api.models import Post, Code


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

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