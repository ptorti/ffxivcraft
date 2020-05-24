import Axios from "axios";

class XIVapi {

    baseUrl = "https://xivapi.com";
    searchUrl = "/search";
    recipeUrl = "/Recipe/{id}";
    lng = "fr";
    private_key = "6e1be05871de497599af61d8f46551b40fbd67efb4b645cd95aed243d8e8066f";

    saved_request = [];

    getImgPathForIcon(iconPath) {
        return this.baseUrl + iconPath;
    }

    findItemsForJob = (job, minLvl, maxLvl, callback) => {
        //ID,GameContentLinks,ItemGlamour.Description_fr,Icon,Name,Description_fr,LevelItem,ClassJobCategory.Name,EquipSlotCategory

        let columns = "ID,GameContentLinks,ItemGlamour.Description_fr,Icon,Name,Description_fr,LevelItem,ClassJobCategory.Name,EquipSlotCategory";

        //'Rarity>=2',
        let filters = [
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

    _buildIngredientFromResponse = (ingredients, data, craftQty , craft) => {

        let cptElement = 0;

        for (let i = 0; i < 10; i++) {
            if (data["ItemIngredient" + i + "TargetID"] > 0) {
                cptElement++;
                //on test si receipe
                let recipeKey = 'ItemIngredientRecipe' + i;
                const jsonIngredient = data["ItemIngredient" + i];
                const name = jsonIngredient['Name_fr'];
                const qty = data["AmountIngredient" + i];
                const nbCraft = data['AmountResult'];
                const newQtyMultiplicaated = (craftQty * qty) / nbCraft;

                if (data[recipeKey] && data[recipeKey] != "null") {

                    this._buildIngredientFromResponse(ingredients, data[recipeKey][0], newQtyMultiplicaated, craft)

                } else {

                    let finded = ingredients.find((element) => {
                        return element.ID == jsonIngredient.ID
                    });

                    if (finded) {
                        finded.qty += newQtyMultiplicaated;

                        if (!finded.craft.includes(craft)) {
                            finded.craft.push(craft);
                        }

                    } else {
                        ingredients.push({
                            ID: jsonIngredient.ID,
                            Name: name,
                            NameEN: jsonIngredient.Name_en,
                            qty: newQtyMultiplicaated,
                            nbCraft: nbCraft,
                            Icon: jsonIngredient.Icon,
                            craft: [craft]
                        });
                    }
                }
            }
        }

    };

    findIngredientsForReceipes = (receipes, callback) => {
        let ingredients = [];

        if (receipes.length == 0) {
            callback(null)
        }
        ;

        receipes.map((receipeInfo, index) => {
            const receipe = receipeInfo.id
            const qty = receipeInfo.qty
            const recipeUrl = this.recipeUrl.replace("{id}", receipe);
            const url = this._buildUrl(
                recipeUrl,
                {});

            this._getJson(url, (datas => {
                //on traite les données:
                const data = datas.data;

                this._buildIngredientFromResponse(ingredients, data, qty, data.Name);

                callback(ingredients);

            }));

        });

    };

    _getJson = (url, callback) => {

        const finded = this.saved_request.find((element) => {
            return element.url === url
        });

        if (finded) {
            console.log(`Saved url ${url}`);
            callback(finded.response);
            return;
        }

        console.log(url);

        Axios.get(url)
            .then(response => {
                callback(response);

                this.saved_request.push(
                    {
                        url: url,
                        response: response
                    }
                )

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

        if (this.private_key) {
            url += "&private_key=" + this.private_key;
        }

        return url;
    };

}

export default XIVapi = new XIVapi();
