class Item{

    id;
    name;
    nameEn;
    iconUrl;
    iLevel;
    levelEquip;
    classJobCategory = [];
    equipSlotCategory = [];
    recipeId;

    setId = id => { this.id = id; return this};
    setName = name => { this.name = name; return this};
    setNameEn = nameEn => { this.nameEn = nameEn; return this};
    setIconUrl = iconUrl => { this.iconUrl = iconUrl; return this};
    setILevel = iLevel => { this.iLevel = iLevel; return this};
    setLevelEquip = levelEquip => { this.levelEquip = levelEquip; return this};
    setClassJobCategory = classJobCategory => { this.classJobCategory = classJobCategory; return this};
    setEquipSlotCategory = equipSlotCategory => { this.equipSlotCategory = equipSlotCategory; return this};
    setRecipeId = recipeId => { this.recipeId = recipeId; return this};

}

export default Item;