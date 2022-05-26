<?php

namespace app\modules\builder\assets;

use app\assets\AssetBundle;

class TinyMceAsset extends AssetBundle
{
    public $sourcePath = '@vendor/tinymce/tinymce';

    public $js = [
        'tinymce.min.js',
    ];
}
