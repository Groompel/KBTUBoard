from django.db import models


class Post(models.Model):
    title = models.CharField(max_length=300, default='title')
    description = models.TextField(default='')
    place = models.TextField(default='')
    photo = models.CharField(default='', max_length=500, blank=True)
    category_id = models.IntegerField(default=1)
    subcategory_id = models.IntegerField(default=1)

    class Meta:
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'
