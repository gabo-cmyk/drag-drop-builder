Drag & Drop Widget / Module
======================

INSTALLATION
------------

### Add the attached script ( Builder.js ) in your project and set compiler for the styles (SCSS). After that, you have to register a store in JSON structure and link for the builder app with the following method:

~~~
    const _getTemplate = (template) => {
        let data = ''
        $.ajax({
            type: 'POST',
            url: window.location.origin + '/builder/' + template,
            dataType: 'html',
            async: false,
            success: function (response) {
                data = response
            }
        });
        return data
    }
~~~

### When you're done with the steps above, you have to add an XHR endpoint for file upload:


If you are using Yii Php Framework You can then use the builder as a form widget using the following way:

~~~
<?= $form->field($model, 'body')->widget(\app\modules\builder_backup\Builder::class)->label(false) ?>
~~~

**NOTES:**
- You only have to register the builder as additional script in case you want the asset builder to convert and compile your scss and js files to css and minified / compressed js.
