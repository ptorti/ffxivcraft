import React, {Component} from "react";
import XIVapi from "../classes/XIVapi";

class EquipmentSearchForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            result_list: null,
            job_list: {
                "ACN": "Arcaniste",
                "ADV": "Toutes les classes",
                "ALC": "Alchimiste",
                "ARC": "Archer",
                "ARM": "Armurier",
                "AST": "Astromancien",
                "BLM": "Mage  Noire",
                "BLU": "Mage Bleu",
                "BRD": "Barde",
                "BSM": "Forgeron",
                "BTN": "Botaniste",
                "CNJ": "Elementaliste",
                "CRP": "Menuisier",
                "CUL": "Cuisinier",
                "DNC": "Danseur",
                "DRG": "Chevalier Dragon",
                "DRK": "Chevalier Noir",
                "FSH": "Pêcheur",
                "GLA": "Gladiateur",
                "GNB": "Pistosabreur",
                "GSM": "Orfèvre",
                "LNC": "Maître d'Hast",
                "LTW": "Tanneur",
                "MCH": "Machiniste",
                "MIN": "Mineur",
                "MNK": "Moine",
                "MRD": "Maraudeur",
                "NIN": "Ninja",
                "PGL": "Pugiliste",
                "PLD": "Paladin",
                "RDM": "Mage Rouge",
                "ROG": "Surineur",
                "SAM": "Samouraï",
                "SCH": "Erudit",
                "SMN": "Invocateur",
                "THM": "Occultiste",
                "WAR": "Guerrier",
                "WHM": "Mage Blanc",
                "WVR": "Couturier"
            },
            /*
            "Body": 0,
                "Ears": 0,
                "Feet": 0,
                "FingerL": 0,
                "FingerR": 0,
                "Gloves": 0,
                "Head": 0,
                "ID": 1,
                "Legs": 0,
                "MainHand": 1,
                "Neck": 0,
                "OffHand": 0,
                "SoulCrystal": 0,
                "Waist": 0,
                "Wrists": 0
             */
            job: 'BRD',
            lvl_min: 480,
            lvl_max: null,
            ingredient_list: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleReceipeChange = this.handleReceipeChange.bind(this);

        this.receipeSearchFormRef = React.createRef();
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
    }

    search = (event) => {
        this.setState({
            result_list: null,
            ingredient_list: null,
        })

        event.preventDefault();
        XIVapi.findItemsForJob(this.state.job, this.state.lvl_min, this.state.lvl_max, (response) => {
            this.setState({
                result_list: response.data.Results
            })
        });
    };

    handleReceipeChange(event) {
        this.receipeSearchFormRef.current.dispatchEvent(new Event("submit"));
    }

    searchReceipe = (event) => {
        event.preventDefault();
        console.log("search receipe");
        let receipesInfos = [];

        [...event.target.elements].map((element) => {
            switch (element.type) {
                case 'checkbox':
                    if (element.checked) {
                        receipesInfos.push({
                            id: element.value,
                            qty: 1
                        })
                    }
                    break;
                case 'number':
                    const existingReceipe = receipesInfos.find(receipe => {
                        return element.name == receipe.id
                    });

                    if (existingReceipe) {
                        existingReceipe.qty = element.value;
                    }
                    break;
            }
        });

        //on raffraichit la liste des ingrédient
        XIVapi.findIngredientsForReceipes(receipesInfos, datas => {

            if (!datas) {
                this.setState({ingredient_list: null})
                return;
            }
            datas.sort((a, b) => {
                return a.Name > b.Name ? 1 : -1
            });


            this.setState({
                ingredient_list: datas
            });
        })

    };


    render() {

        const jobs = this.state.job_list;

        return (
            <>
                <form onSubmit={this.search}>
                    <div>
                        <label htmlFor={'job'}> Classe :</label>
                        <select name={'job'} id={'job'} onChange={this.handleChange}>
                            <option value={""}>Choisissez une classe</option>
                            {
                                Object.keys(jobs).map(key => {
                                    return (
                                        <option key={key} value={key}
                                                selected={this.state.job == key}>{jobs[key]}</option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div>
                        <label htmlFor={'lvl_min'}> Level mini :</label>
                        <input type='number' name={'lvl_min'} id={'lvl_min'} onChange={this.handleChange}
                               value={this.state.lvl_min}/>
                    </div>

                    <div>
                        <label htmlFor={'lvl_min'}> Level maxi :</label>
                        <input type='number' name={'lvl_max'} id={'lvl_max'} onChange={this.handleChange}
                               value={this.state.lvl_max}/>
                    </div>

                    <input type="submit" value="Rechercher"/>
                </form>

                {this.state.result_list ?
                    <form onSubmit={this.searchReceipe} ref={this.receipeSearchFormRef}>
                        <table>
                            <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th>Icon</th>
                                <th>Name</th>
                                <th>Lvl</th>
                                <th>ClassJobCategory</th>
                                <th>EquipSlotCategory</th>
                                <th>Recipe</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.result_list.map((data, key) => {
                                return (
                                    <tr key={key}>
                                        <td><input type={"checkbox"} onChange={this.handleReceipeChange}
                                                   defaultChecked={false}
                                                   value={data.GameContentLinks.Recipe.ItemResult}/></td>
                                        <td><input type={"number"} onChange={this.handleReceipeChange}
                                                   name={data.GameContentLinks.Recipe.ItemResult} defaultValue={1}
                                                   style={{width: '30px'}}/></td>
                                        <td><img src={XIVapi.getImgPathForIcon(data.Icon)}/></td>
                                        <td>{data.Name}</td>
                                        <td>{data.LevelItem}</td>
                                        <td>{data.ClassJobCategory.Name}</td>
                                        <td>
                                            {(() => {
                                                if (data.EquipSlotCategory) {
                                                    return Object.entries(data.EquipSlotCategory).map(slotInfo => {
                                                        return (slotInfo[1] == 1) ? slotInfo[0] + " " : " "
                                                    });
                                                }
                                            })()}
                                        </td>
                                        <td>{data.GameContentLinks.Recipe.ItemResult}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </form>
                    : null

                }

                {this.state.ingredient_list ?
                    <table>
                        <thead>
                        <tr>
                            <th>Quantity</th>
                            <th>Icon</th>
                            <th>Name</th>

                            <th>Equipements</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.ingredient_list.map((data, key) => {
                            return (
                                <tr key={key}>
                                    <td>{Math.ceil(data.qty)}</td>
                                    <td><img src={XIVapi.getImgPathForIcon(data.Icon)}/></td>
                                    <td>{data.Name}</td>
                                    <td>
                                        {(() => {
                                            if (data.craft) {
                                                return Object.entries(data.craft).map(craft => {
                                                    return craft[1] + " - "
                                                });
                                            }
                                        })()}
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                    : null

                }


            </>
        );
    }

}

export default EquipmentSearchForm;