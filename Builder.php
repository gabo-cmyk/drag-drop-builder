<?php

namespace app\modules\builder;

use app\modules\builder\assets\BuilderAsset;
use app\modules\builder\assets\TinyMceAsset;
use Yii;
use yii\helpers\Html;
use yii\helpers\Json;
use yii\widgets\InputWidget;

class Builder extends InputWidget
{
    public $clientOptions = [];

    public $pluginOptions = [];

    /**
     * @var bool whether to set the on change event for the editor. This is required to be able to validate data.
     * @see https://github.com/2amigos/yii2-tinymce-widget/issues/7
     */
    public $triggerSaveOnBeforeValidateForm = true;

    /**
     * @inheritdoc
     */
    public function run()
    {
        $input = $this->hasModel() ? Html::activeTextarea($this->model, $this->attribute, $this->options) : Html::textarea($this->name, $this->value, $this->options);

        $this->registerClientScript();

        return '<div class="page-builder_backup">
                    ' . $input . '
                    <div class="page-builder__editable-area">

                <div class="loader-wrapper d-none">
                    <svg class="loader" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <circle cx="30" cy="30" r="28" style="stroke-dashoffset: 0px; transition-duration: 0s;"></circle>
                        </g>
                     </svg>
                    <span class="loader-progress-wrapper">
                        <span class="loader-progress">100</span>
                        <span>%</span>
                    </span>
                </div>

                    </div>
                    <div class="page-builder__sidebar">
                        <div class="page-builder__sidebar-hide-btn">
                            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.17192 6.99999L0.221924 2.04999L1.63592 0.635986L7.99992 6.99999L1.63592 13.364L0.221924 11.95L5.17192 6.99999Z"
                                      fill="black"/>
                            </svg>
                        </div>
                        <div class="page-builder__sidebar-tabs">
                        </div>
                        <div class="page-builder__sidebar-inner"></div>
                    </div>
                </div>';
    }

    /**
     * Registers tinyMCE js plugin
     */
    protected function registerClientScript()
    {
        $js = [];
        $view = $this->getView();

        TinyMceAsset::register($view);
        $ba = BuilderAsset::register($view);
        \kartik\select2\Select2Asset::register($view);

//        $tinymceAsset = \dosamigos\tinymce\TinyMceLangAsset::register($this);
//        $tinyLanguage = file_exists($tinymceAsset->basePath . '/langs/' . Yii::$app->language . '.js') ? Yii::$app->language : 'en';
//        $tinyLanguage = file_exists($tinymceAsset->basePath . '/langs/' . Yii::$app->language . '_' . strtoupper(Yii::$app->language) . '.js') ? Yii::$app->language . '_' . strtoupper(Yii::$app->language) : Yii::$app->language;

        $id = $this->options['id'];

        $options = Json::encode(array_merge($this->pluginOptions, $this->clientOptions));

        $components = [
            ['id' => '1', 'type' => 'template', 'preview' => $ba->baseUrl . '/images/previews/black/form_preview--black.svg', 'title' => 'Form', 'template' => 'form', 'content' => 'form.php', 'inputs' => [
                ['id' => 'f-name', 'title' => 'First name', 'type' => 'text', 'textarea' => 'false'],
                ['id' => 'l-name', 'title' => 'Last name', 'type' => 'text', 'textarea' => 'false'],
                ['id' => 'email', 'title' => 'The email address', 'type' => 'email', 'textarea' => 'false'],
                ['id' => 'gdpr', 'title' => 'The GDPR consent', 'type' => 'checkbox', 'textarea' => 'false'],
                ['id' => 'file', 'title' => 'The file', 'type' => 'file', 'textarea' => 'false'],
                ['id' => 'message', 'title' => 'The message text', 'type' => 'text', 'textarea' => 'true'],
                ['id' => 'submit', 'title' => 'The submit button', 'type' => 'submit', 'textarea' => 'false'],
            ]],
            ['id' => '18', 'type' => 'template', 'preview' => $ba->baseUrl . '/images/previews/black/file-upload_preview--black.svg', 'title' => 'File Upload Template', 'template' => 'component', 'content' => 'file-upload-template.php'],
            ['id' => '12', 'type' => 'template', 'preview' => $ba->baseUrl . '/images/previews/black/hero_preview--black.svg', 'title' => 'Hero template', 'template' => 'component', 'content' => 'hero_template.php'],
            ['id' => '2', 'type' => 'template', 'preview' => $ba->baseUrl . '/images/previews/black/text_preview_2--black.svg', 'title' => 'Template 1', 'template' => 'component', 'content' => 'template.php'],
            ['id' => '3', 'type' => 'template', 'preview' => $ba->baseUrl . '/images/previews/black/text_preview--black.svg', 'title' => 'Template 5', 'template' => 'component', 'content' => 'template_5.php'],
            ['id' => '4', 'type' => 'template', 'preview' => $ba->baseUrl . '/images/previews/black/text+image_preview--black.svg', 'title' => 'Template 2', 'template' => 'component', 'content' => 'template_2.php'],
            ['id' => '5', 'type' => 'template', 'preview' => $ba->baseUrl . '/images/previews/black/text-in-columns_template--black.svg', 'title' => 'Template 3', 'template' => 'component', 'content' => 'template_3.php'],
            ['id' => '6', 'type' => 'template', 'preview' => $ba->baseUrl . '/images/previews/black/img_preview--black.svg', 'title' => 'Template 4', 'template' => 'component', 'content' => 'template_4.php'],
            ['id' => '7', 'type' => 'template', 'preview' => $ba->baseUrl . '/images/previews/black/editor_preview--black.svg', 'title' => 'Editor', 'template' => 'editor', 'content' => 'editor.php'],
            ['id' => '8', 'type' => 'template', 'preview' => $ba->baseUrl . '/images/previews/black/product_preview-1--black.svg', 'title' => 'Product Template', 'content' => 'product-template.php'],
            ['id' => '9', 'type' => 'template', 'preview' => $ba->baseUrl . '/images/previews/black/product_preview-2--black.svg', 'title' => 'Product Template Alt', 'template' => 'component', 'content' => 'product-template_alt.php'],
            ['id' => '10', 'type' => 'template', 'preview' => $ba->baseUrl . '/images/previews/black/product_preview-3--black.svg', 'title' => 'Product Template 3', 'template' => 'component', 'content' => 'product-template_three.php'],
            ['id' => '11', 'type' => 'template', 'preview' => $ba->baseUrl . '/images/previews/black/inst_preview--black.svg', 'title' => 'Insta template', 'template' => 'component', 'content' => 'insta-template.php'],
            ['id' => '19', 'type' => 'template', 'preview' => $ba->baseUrl . '/images/previews/black/yt_preview--black.svg', 'title' => 'Youtube template', 'template' => 'component', 'content' => 'youtube-template.php'],
            ['id' => '14', 'type' => 'template', 'preview' => $ba->baseUrl . '/images/previews/black/gallery_preview--black.svg', 'title' => 'Gallery', 'template' => 'gallery', 'content' => 'gallery_template.php', 'appearance' => [
                ['title' => 'type-a', 'preview' => $ba->baseUrl . '/images/previews/gallery_type-1_preview.svg', 'content' => 'galleries/type_a.php'],
                ['title' => 'type-b', 'preview' => $ba->baseUrl . '/images/previews/gallery_type-2_preview.png', 'content' => 'galleries/type_b.php'],
            ]],
            ['id' => '20', 'type' => 'template', 'preview' => $ba->baseUrl . '/images/previews/black/layout_preview--black.svg', 'title' => 'Products template', 'template' => 'products', 'content' => 'products_template.php', 'data' => [
                ['id' => 'p-1', 'title' => 'product', 'href' => '/product', 'thumbnail' => $ba->baseUrl . '/images/thumbnails/product_thumbnail--B.jpg'],
                ['id' => 'p-2', 'title' => 'product 2', 'href' => '/product-2', 'thumbnail' => $ba->baseUrl . '/images/thumbnails/product_thumbnail--B.jpg'],
                ['id' => 'p-3', 'title' => 'product 3', 'href' => '/product-3', 'thumbnail' => $ba->baseUrl . '/images/thumbnails/product_thumbnail--B.jpg'],
            ]],
            ['id' => '15', 'type' => 'layout', 'preview' => $ba->baseUrl . '/images/previews/black/layout_preview--black.svg', 'title' => 'Layout 1', 'template' => 'component', 'content' => 'layout.php'],
            ['id' => '16', 'type' => 'layout', 'preview' => $ba->baseUrl . '/images/previews/black/layout_preview-2--black.svg', 'title' => 'Layout 2', 'template' => 'component', 'content' => 'layout_2.php'],
            ['id' => '17', 'type' => 'layout', 'preview' => $ba->baseUrl . '/images/previews/black/layout_preview-3--black.svg', 'title' => 'Layout 3', 'template' => 'component', 'content' => 'layout_3.php'],
            ['type' => 'theme', 'preview' => $ba->baseUrl . '/images/previews/theme_preview-standard.svg', 'title' => 'Standard theme', 'class' => 'standard-theme', 'colours' => ['background' => 'transparent', 'text' => 'black', 'pattern' => 'false']],
            ['type' => 'theme', 'preview' => $ba->baseUrl . '/images/previews/theme_preview-dark.svg', 'title' => 'Dark theme', 'class' => 'dark-theme', 'colours' => ['background' => 'black', 'text' => 'white', 'pattern' => 'false']],
            ['type' => 'theme', 'preview' => $ba->baseUrl . '/images/previews/theme_preview-orange.svg', 'title' => 'Orange theme', 'class' => 'orange-theme', 'colours' => ['background' => 'orange', 'text' => 'white', 'pattern' => 'false']],
        ];

        foreach ($components as &$component) {
            if (isset($component['content'])) {
                $component['content'] = $view->renderPhpFile(Yii::getAlias('@app/modules/builder_backup/templates/' . $component['content']), ['builderAsset' => $ba]);
            }

            if (isset($component['appearance']) && is_array($component['appearance'])) {
                foreach ($component['appearance'] as &$appearance) {
                    if (isset($appearance['content'])) {
                        $appearance['content'] = $view->renderPhpFile(Yii::getAlias('@app/modules/builder_backup/templates/' . $appearance['content']), ['builderAsset' => $ba]);
                    }
                }
            }
        }

        $js[] = 'builder_backup.init(\'' . $id . '\', ' . json_encode($components) . ', ' . $options . ')';
        if ($this->triggerSaveOnBeforeValidateForm) {
            $js[] = "$('#{$id}').parents('form').on('beforeValidate', function() { tinymce.triggerSave(); });";
        }
        if (count($js)) {
            $view->registerJs(implode("\n", $js));
        }
    }
}
