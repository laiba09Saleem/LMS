from rest_framework import serializers
from django.contrib.auth import authenticate
from accounts.models import User, UserProfile
from academics.models import Department, Semester

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['user_id', 'name', 'email', 'password', 'role', 'status', 'created_at']
        read_only_fields = ['user_id', 'created_at']
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    semester_title = serializers.CharField(source='semester.title', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['profile_id', 'user', 'avatar', 'phone', 'bio', 'department', 
                 'semester', 'department_name', 'semester_title', 'created_at', 'updated_at']
        read_only_fields = ['profile_id', 'created_at', 'updated_at']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'role']
        extra_kwargs = {
            'role': {'required': False}
        }
    
    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if email and password:
            user = authenticate(request=self.context.get('request'), 
                              email=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid email or password')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
        else:
            raise serializers.ValidationError('Must include email and password')
        
        data['user'] = user
        return data

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=6)