import React, {Component} from "react";
import Ingredient from "./../classes/model/Ingredient";
import IngredientTable from "./IngredientTable";
import Item from "../classes/model/Item";
import ItemTable from "./ItemTable";
import Recipe from "./../classes/model/Recipe";
import RecipeTable from "./RecipeTable";
import ItemSeach from "./ItemSeach";

class App2 extends Component {


    constructor(props) {
        super(props);

        this.state = {
            ingredients: [
                new Ingredient().setId(20014).setName("Agrégat d'eau").setIconUrl("https://xivapi.com/i/020000/020014.png").setQuantity(1),
                new Ingredient().setId(20013).setName("Agrégat de feu").setIconUrl("https://xivapi.com/i/020000/020013.png").setQuantity(2)
            ],
            items: [
                new Item().setId(30619).setIconUrl("https://xivapi.com/i/030000/030619.png").setLevelEquip(80).setILevel(480).setClassJobCategory(['PLD','GLA']).setEquipSlotCategory(['HEAD'])
            ],
            recipes: [
                new Recipe().setId(1).setQuantity(2).setItem(
                    new Item().setId(30619).setIconUrl("https://xivapi.com/i/030000/030619.png").setLevelEquip(80).setILevel(480).setClassJobCategory(['PLD','GLA']).setEquipSlotCategory(['HEAD'])
                )
            ]
        };

    }

    render() {
        return (
            <>

                <h1> Formulaire </h1>
                <ItemSeach/>

                <h1> Composent ItemTable </h1>
                <button className="btn " onClick={() => {
                    this.state.items.push(
                        new Item().setId(31183).setIconUrl("https://xivapi.com/i/031000/031183.png").setLevelEquip(80).setILevel(480).setClassJobCategory(['PGL','MNK']).setEquipSlotCategory(['HAND'])
                    );
                    this.setState({
                        ingredients: this.state.items
                    });
                }}>
                    Ajouter un item
                </button>
                <ItemTable items={this.state.items}/>


                <h1> Composent RecipeTable </h1>
                <button className="btn " onClick={() => {
                    this.state.recipes.push(
                        new Recipe().setId(2).setQuantity(1).setItem(
                            new Item().setId(31183).setIconUrl("https://xivapi.com/i/031000/031183.png").setLevelEquip(80).setILevel(480).setClassJobCategory(['PGL','MNK']).setEquipSlotCategory(['HAND'])
                        )
                    );
                    this.setState({
                        recipes: this.state.recipes
                    });
                }}>
                    Ajouter une recette
                </button>
                <RecipeTable recipes={this.state.recipes}/>


                <h1> Composent IngredientTable </h1>
                <button className="btn " onClick={() => {
                    this.state.ingredients.push(new Ingredient().setId(20017).setName("Agrégat de foudre").setIconUrl("https://xivapi.com/i/020000/020017.png").setQuantity(1));
                    this.setState({
                        ingredients: this.state.ingredients
                    });
                }}>
                    Ajouter un ingredient
                </button>
                <IngredientTable ingredients={this.state.ingredients}/>
            </>
        )
    }

}

export default App2;