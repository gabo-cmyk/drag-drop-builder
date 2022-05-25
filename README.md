Yii 2 Content Builder Widget / Module
======================


INSTALLATION
------------

### Add the following lines in your configuration:

~~~
'modules' => [
    'builder_backup' => [
        'class' => 'app\modules\builder_backup\Module',
    ],
],
~~~

You can then use the builder_backup as a form widget using the following way:

~~~
<?= $form->field($model, 'body')->widget(\app\modules\builder_backup\Builder::class)->label(false) ?>
~~~

**NOTES:**
- You only have to register the builder_backup as a module in case you want the asset builder_backup to convert and compile your scss and js files to css and minified / compressed js.
