<?php

/* @var \yii\web\View $this */
/* @var \app\modules\builder\assets\BuilderAsset $builderAsset */

?>
<div class="template product-template" data-template="6" data-template-type="product">
    <div class="row align-items-center" data-product>
        <div class="col-lg-5 product-template__left">
            <p data-editable data-content-type="text">
                Az animációs filmek közül az Encanto, a Menekülés, a Luca, A Mitchellék a gépek ellen, valamint a Raya
                és az
                utolsó sárkány szerepel az Oscar-jelöltek listáján. A nemzetközi film-kategória öt jelöltje: a japán
                Drive
                My Car, a dán Menekülés, az olasz Isten keze, a bhutáni Lunana: A Yak in the Classroom és A világ
                legrosszabb embere című norvég produkció lett. A legjobb dokumentumfilm-kategóriában a Summer of Soul
                (...Or, When the Revolution Could Not Be Televised), a Menekülés, az Attica, az Ascension és a Writing
                With
                Fire ért el jelölést. A Menekülés című dán produkció három kategóriában, az animációs filmek, a
                nemzetközi
                filmek és a dokumentum-filmek között is Oscar-díjat kaphat.
            </p>
        </div>
        <div class="col-lg-7 product-template__right">
            <div class="upload-drop-area is-empty">
                <input type="file" required name="fileName" data-image accept="image/*"/>
            </div>
            <span class="product-template__title" data-editable data-content-type="title">Max Factor</span>
            <span class="product-template__desc" data-editable data-content-type="desc">False Lash Effect vízálló szempillaspirál a dús és szétválasztott pillákért</span>
            <span class="product-template__price" data-editable data-content-type="price">3860 Ft</span>
            <a href="/site/latest" class="primary-btn" data-anchor>
                <span data-editable data-content-type="btn">Vásárlás</span>
                <?= file_get_contents($builderAsset->basePath . '/images/icons/arrow_right_icon.svg') ?>
            </a>
        </div>
    </div>
</div>
