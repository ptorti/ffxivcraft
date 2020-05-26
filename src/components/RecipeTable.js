import React, {Component} from "react";
import {Image} from "react-bootstrap";
import Table from "../components_ui/Table";

class RecipeTable extends Component {

    /**
     *
     * @param {Item[]} item
     */
    constructor({recipes}) {
        super(recipes);

        this.state = {
            recipes: recipes ?? []
        }
    }

    convertToArray = () => {
        const header = [];
        const body = [];
        this.state.recipes.map(recipe => {
            body.push([
                <Image src={recipe.item.iconUrl}/>,
                recipe.quantity,
                recipe.item.name,
                <button className="btn btn-primary">Sup </button>
            ])
        });
        return {header, body}

    };

    render() {
        const {header, body} = this.convertToArray();

        return (
            <Table header={header} body={body} tableClass=" "/>
        )
    }

}

export default RecipeTable;