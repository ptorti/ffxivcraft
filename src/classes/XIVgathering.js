import Axios from "axios";
import React from "react";

import Node from "./XIVgathering/nodes.json";
import Dictionary from "./XIVgathering/dictionary.json";
import Items from "./XIVgathering/items2.json";

class XIVgathering {

    version = '5.2.200219';
    baseUrl = "https://ffxiv-gathererclock.com/data";
    dataUrl = "/items2.json";
    nodeUrl = "/nodes.json";
    dictionnaryUrl = "/dictionary.json";
    saved_request = [];

    getIngredientInfo = (ingredientData, callback) => {

        console.log(Items);
        console.log(ingredientData.NameEN);
        Object.entries(Items).map(reponseElement => {
            reponseElement = reponseElement[1];
            console.log('test de '+reponseElement.label_en);
            if (reponseElement.label_en == ingredientData.NameEN) {
                console.log("finded");
                console.log(reponseElement);
                ingredientData.gathering = reponseElement;
            }
        });

        callback(ingredientData);

    }

}

export default XIVgathering = new XIVgathering();