<?php

/* @var \yii\web\View $this */
/* @var \app\modules\builder\assets\BuilderAsset $builderAsset */

?>

<div class="template template-row embed-template" data-template="1" data-embed data-template-type="youtube">
    <div class="embed-template__inner">
        <div class="embed-template__headline">
            <?= file_get_contents($builderAsset->basePath . '/images/logos/youtube.svg') ?>
            <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis iusto laudantium, libero modi pariatur quam!</span>
        </div>
        <div class="embed-template__input-wrapper">
            <input placeholder="Youtube embed" class="embed-template__input youtube-template-input mr-2" type="text">
            <div class="embed__btn youtube-embed-btn is-disabled">Hozzáadás</div>
        </div>
    </div>
</div>
