import React, {Component} from "react";
import {Image} from "react-bootstrap";
import Table from "../components_ui/Table";

class ItemTable extends Component {

    /**
     *
     * @param {Item[]} item
     */
    constructor({items}) {
        super(items);

        this.state = {
            items: items ?? []
        }
    }

    convertToArray = () => {
        const header = ["", "Nom", "Level","iLevel", "Classe", "Emplacement",""];
        const body = [];
        this.state.items.map(item => {
            body.push([
                <Image src={item.iconUrl}/>,
                item.name,
                item.levelEquip,
                item.iLevel,
                item.classJobCategory,
                item.equipSlotCategory,
                <button className="btn btn-primary">Ajouter </button>
            ])
        });
        return {header, body}

    };

    render() {
        const {header, body} = this.convertToArray();

        return (
            <Table header={header} body={body}/>
        )
    }

}

export default ItemTable;