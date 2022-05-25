<?php

/* @var \yii\web\View $this */
/* @var \app\modules\builder\assets\BuilderAsset $builderAsset */

?>

<div class="template template-row embed-template" data-template="1" data-embed data-template-type="instagram">
    <div class="embed-template__inner">
        <div class="embed-template__headline">
            <?= file_get_contents($builderAsset->basePath . '/images/logos/instagram-text.svg') ?>
            <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis iusto laudantium, libero modi pariatur quam!</span>
        </div>
        <div class="embed-template__input-wrapper">
            <input placeholder="Instagram embed" required class="embed-template__input insta-template-input  mr-2" type="text">
            <div class="embed__btn insta-embed-btn is-disabled">Hozzáadás</div>
        </div>
    </div>
</div>
