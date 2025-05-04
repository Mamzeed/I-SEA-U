from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Customer

# ฟอร์มสำหรับข้อมูลของลูกค้า
class CustomerForm(forms.ModelForm):
    class Meta:
        model = Customer
        fields = ['fullname', 'address', 'province', 'post_code', 'tel']

# ฟอร์มสำหรับการสร้างผู้ใช้ใหม่ (ขยายจาก UserCreationForm)
class ExtendedUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email']  # เพิ่ม fields ที่ต้องการ
