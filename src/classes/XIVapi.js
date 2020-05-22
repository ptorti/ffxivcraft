import Axios from "axios";

class XIVapi {

    baseUrl = "https://xivapi.com";
    searchUrl = "/search";
    recipeUrl = "/Recipe/{id}";
    lng = "fr";
    private_key="6e1be05871de497599af61d8f46551b40fbd67efb4b645cd95aed243d8e8066f";

    getImgPathForIcon(iconPath) {
        return this.baseUrl + iconPath;
    }

    findItemsForJob = (job, minLvl, maxLvl, callback) => {
        //ID,GameContentLinks,ItemGlamour.Description_fr,Icon,Name,Description_fr,LevelItem,ClassJobCategory.Name,EquipSlotCategory

        let columns = "ID,GameContentLinks,ItemGlamour.Description_fr,Icon,Name,Description_fr,LevelItem,ClassJobCategory.Name,EquipSlotCategory";

        let filters = [
            'Rarity>=2',
            'EquipSlotCategoryTarget=EquipSlotCategory',
            'GameContentLinks.Recipe.ItemResult>1'
        ];
        if (minLvl) {
            filters.push('LevelItem>=' + minLvl)
        }
        if (maxLvl) {
            filters.push('LevelItem<=' + maxLvl)
        }
        if (job) {
            filters.push('ClassJobCategory.' + job + '=1');
        }
        const url = this._buildUrl(
            this.searchUrl,
            {
                indexes: "item",
                filters: filters,
                columns: columns
            });

        let response = this._getJson(url, callback);

    };

    findIngredientsForReceipes = (receipes, callback) => {
        let ingredients = [];

        console.log(receipes);

        if(receipes.length == 0){
            callback(null)
        };

        receipes.map((receipe, index) => {
            const recipeUrl = this.recipeUrl.replace("{id}", receipe);
            const url = this._buildUrl(
                recipeUrl,
                {});

            this._getJson(url, (datas => {
                //on traite les données:
                const data = datas.data;
                for (let i = 0; i < 10; i++) {
                    if (data["ItemIngredient" + i + "TargetID"] > 0) {
                        const jsonIngredient = data["ItemIngredient" + i];
                        const name = jsonIngredient['Name_fr'];
                        const qty = data["AmountIngredient" + i];
                        const nbCraft = data['AmountResult'];

                        let finded = ingredients.find((element) => {
                            return element.ID == jsonIngredient.ID
                        });

                        if (finded) {
                            finded.qty += qty;
                        } else {
                            ingredients.push({
                                ID: jsonIngredient.ID,
                                Name: name,
                                qty: qty,
                                nbCraft: nbCraft,
                                Icon: jsonIngredient.Icon,
                                craft: data.Name_fr
                            });
                        }
                    }




                }
                if (index >= (receipes.length - 1)) {
                    callback(ingredients);
                }
            }));

        });


    };

    _getJson = (url, callback) => {

        Axios.get(url)
            .then(response => {
                console.log(response);
                callback(response);
            })

    };

    _buildUrl = (part, params) => {
        //construction url
        let url = this.baseUrl + part + "?language=" + this.lng;
        const {indexes, filters, columns} = params;
        if (indexes) {
            url += "&indexes=" + indexes;
        }
        if (filters) {
            url += "&filters=" + filters;
        }
        if (columns) {
            url += "&columns=" + columns;
        }

        if (this.private_key){
            url += "&private_key=" + this.private_key;
        }

        return url;
    };

}

export default XIVapi = new XIVapi();
