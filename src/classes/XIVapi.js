import Axios from "axios";
import React from "react";

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

    getXivIconForSlot(slot) {
        slot = slot.replace("Gloves", "Hands");
        slot = slot.replace("Gloves", "Hands");
        slot = slot.replace("MainHand", "MainArm");
        slot = slot.replace("OffHand", "SubArm");
        slot = slot.replace("Ears", "Earrings");
        slot = slot.replace("Neck", "Necklace");
        slot = slot.replace("Wrists", "Bracelets");
        slot = slot.replace("FingerL", "Ring");
        slot = slot.replace("FingerR", "Ring");

        return 'xiv-Armoury_' + slot;
    }

    getXivIconForJob(job) {
        return 'xiv-class_job_' + job;
    }

    findItemsForJob = (search, job, minLvl, maxLvl, callback) => {
        //ID,GameContentLinks,ItemGlamour.Description_fr,Icon,Name,Description_fr,LevelItem,ClassJobCategory.Name,EquipSlotCategory

        let columns = "ID,GameContentLinks,Icon,Name,Description_fr,LevelItem,ClassJobCategory.Name,ClassJobCategory.Name_en,EquipSlotCategory";

        //'Rarity>=2',
        let filters = [
            'EquipSlotCategoryTarget=EquipSlotCategory',
            'GameContentLinks.Recipe.ItemResult>1'
        ];


        if (search && search.trim !== "" && search === "null") {
            search = search.trim;
        }

        if (minLvl) {
            filters.push('LevelItem>=' + minLvl)
        }
        if (maxLvl) {
            filters.push('LevelItem<=' + maxLvl)
        }
        if (job && job !== "null") {
            filters.push('ClassJobCategory.' + job + '=1');
        }
        const url = this._buildUrl(
            this.searchUrl,
            {
                search: search,
                indexes: "item",
                filters: filters,
                columns: columns
            });

        console.log(url);
        let response = this._getJson(url, callback);

    };

    _buildIngredientFromResponse = (ingredients, data, craftQty, slot) => {

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

                    this._buildIngredientFromResponse(ingredients, data[recipeKey][0], newQtyMultiplicaated, slot)

                } else {

                    let finded = ingredients.find((element) => {
                        return element.ID == jsonIngredient.ID
                    });

                    if (finded) {
                        finded.qty += newQtyMultiplicaated;

                        let fusionned = slot.concat(finded.craft);
                        finded.craft = fusionned.filter((item, pos) => fusionned.indexOf(item) === pos)

                    } else {
                        ingredients.push({
                            ID: jsonIngredient.ID,
                            Name: name,
                            NameEN: jsonIngredient.Name_en,
                            qty: newQtyMultiplicaated,
                            nbCraft: nbCraft,
                            Icon: jsonIngredient.Icon,
                            craft: slot
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

                let slots = [];

                if (receipeInfo.data.EquipSlotCategory) {
                    Object.entries(receipeInfo.data.EquipSlotCategory).map(slotInfo => {
                        if (slotInfo[0] && slotInfo[1] === 1 && slotInfo[0] !== "ID") {
                            slots.push(slotInfo[0])
                        }
                    });
                }

                this._buildIngredientFromResponse(ingredients, data, qty, slots);

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
        const {search, indexes, filters, columns} = params;

        if (search) {
            url += "&string=" + search;
        }

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
