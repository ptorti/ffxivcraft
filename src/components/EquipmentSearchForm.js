import React, {Component} from "react";
import XIVapi from "../classes/XIVapi";
import XIVgathering from "../classes/XIVgathering";
import Select from 'react-select';
import {Tabs, Tab, Table, Image} from "react-bootstrap"
import Bg from "./../img/ffxivbg.jpg"
import Ascii from "./Ascii"

class EquipmentSearchForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            result_list: null,
            job_list: {
                null: {label_fr: "Tous", icon_number: '000'},
                "ACN": {label_fr: "Arcaniste", icon_number: '026'},
                "ADV": {label_fr: "Toutes les classes", icon_number: '000'},
                "ALC": {label_fr: "Alchimiste", icon_number: '014'},
                "ARC": {label_fr: "Archer", icon_number: '005'},
                "ARM": {label_fr: "Armurier", icon_number: '010'},
                "AST": {label_fr: "Astromancien", icon_number: '033'},
                "BLM": {label_fr: "Mage  Noire", icon_number: '025'},
                "BLU": {label_fr: "Mage Bleu", icon_number: '036'},
                "BRD": {label_fr: "Barde", icon_number: '023'},
                "BSM": {label_fr: "Forgeron", icon_number: '009'},
                "BTN": {label_fr: "Botaniste", icon_number: '017'},
                "CNJ": {label_fr: "Elementaliste", icon_number: '006'},
                "CRP": {label_fr: "Menuisier", icon_number: '008'},
                "CUL": {label_fr: "Cuisinier", icon_number: '015'},
                "DNC": {label_fr: "Danseur", icon_number: '038'},
                "DRG": {label_fr: "Chevalier Dragon", icon_number: '022'},
                "DRK": {label_fr: "Chevalier Noir", icon_number: '032'},
                "FSH": {label_fr: "Pêcheur", icon_number: '018'},
                "GLA": {label_fr: "Gladiateur", icon_number: '001'},
                "GNB": {label_fr: "Pistosabreur", icon_number: '037'},
                "GSM": {label_fr: "Orfèvre", icon_number: '011'},
                "LNC": {label_fr: "Maître d'Hast", icon_number: '004'},
                "LTW": {label_fr: "Tanneur", icon_number: '012'},
                "MCH": {label_fr: "Machiniste", icon_number: '031'},
                "MIN": {label_fr: "Mineur", icon_number: '016'},
                "MNK": {label_fr: "Moine", icon_number: '020'},
                "MRD": {label_fr: "Maraudeur", icon_number: '003'},
                "NIN": {label_fr: "Ninja", icon_number: '030'},
                "PGL": {label_fr: "Pugiliste", icon_number: '002'},
                "PLD": {label_fr: "Paladin", icon_number: '019'},
                "RDM": {label_fr: "Mage Rouge", icon_number: '035'},
                "ROG": {label_fr: "Surineur", icon_number: '029'},
                "SAM": {label_fr: "Samouraï", icon_number: '034'},
                "SCH": {label_fr: "Erudit", icon_number: '028'},
                "SMN": {label_fr: "Invocateur", icon_number: '027'},
                "THM": {label_fr: "Occultiste", icon_number: '007'},
                "WAR": {label_fr: "Guerrier", icon_number: '021'},
                "WHM": {label_fr: "Mage Blanc", icon_number: '024'},
                "WVR": {label_fr: "Couturier", icon_number: '013'}
            },

            job: null,
            lvl_min: 480,
            lvl_max: null,
            search: null,
            ingredient_list: null,
            receipes: []
        };

        this.slots = {
            "Head": "Tête",
            "Body": "Corps",
            "Gloves": "Mains",
            "Waist": "Ceinture",
            "Legs": "Jambes",
            "Feet": "Pieds",
            "Ears": "B. Oreilles",
            "Neck": "Cou",
            "Wrists": "Poignets",
            "FingerL": "Anneaux",
            "MainHand": "Arme",
            "OffHand": "Arme Sec",
            "Other": "Autre"
        }

        this.select2Jobs = Object.keys(this.state.job_list).map((key, value) => {
            return (
                {value: key, label: this.state.job_list[key].label_fr}
            )
        });


        this.handleChange = this.handleChange.bind(this);
        this.handleReceipeChange = this.handleReceipeChange.bind(this);
        this.addToReceipe = this.addToReceipe.bind(this);
        this.removeReceipe = this.removeReceipe.bind(this);
        this.getIngredientInfo = this.getIngredientInfo.bind(this);

        this.receipeSearchFormRef = React.createRef();
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
    }

    handleChangeSelect = (selectedOption) => {
        this.setState({job: selectedOption.value});
    }

    search = (event) => {
        this.setState({
            result_list: null,
            ingredient_list: null,
        })

        event.preventDefault();
        XIVapi.findItemsForJob(this.state.search, this.state.job, this.state.lvl_min, this.state.lvl_max, (response) => {
            this.setState({
                result_list: response.data.Results
            })
        });
    };

    handleReceipeChange(event) {
        this.receipeSearchFormRef.current.dispatchEvent(new Event("submit"));
    }

    getIngredientInfo = data => {
        console.log(data);
        XIVgathering.getIngredientInfo(data, ingredient => {
            console.log(ingredient);
        });

    }

    searchReceipes = (receipes) => {
        //on raffraichit la liste des ingrédient
        this.setState({receipes: receipes})

        XIVapi.findIngredientsForReceipes(receipes, datas => {

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

    removeReceipe = (receipeToRemove) => {
        let receipes = this.state.receipes;

        let receipeFinded = receipes.find(receipe => {
            return receipe.id === receipeToRemove.id
        })

        if (receipeFinded) {
            receipeFinded.qty--;
        }

        let cleanReceipes = [];
        receipes.map(element => {
            if (element.qty >= 1) {
                cleanReceipes.push(element)
            }
        });

        this.searchReceipes(cleanReceipes);
    };

    addToReceipe = (receipeToAdd) => {

        let receipes = this.state.receipes;

        let receipeFinded = receipes.find(receipe => {
            return receipe.id === receipeToAdd.id
        })

        if (receipeFinded) {
            receipeFinded.qty++;
        } else {
            receipes.push({
                id: receipeToAdd.id,
                qty: 1,
                data: receipeToAdd.data
            });
        }

        //on sauvegarde
        this.searchReceipes(receipes);

    };


    renderRowResult = (category, categoryName) => {
        let slotsFiltered = this.state.result_list;

        if (slotsFiltered && category !== "all") {
            slotsFiltered = this.state.result_list.filter(result => {
                if (category === "Other") {
                    return (!result.EquipSlotCategory);
                }
                return (result.EquipSlotCategory && result.EquipSlotCategory[category] === 1);
            });
        }

        const rows = slotsFiltered ?
            slotsFiltered.map((data, key) => {

                    let selectedClass = "";
                    this.state.receipes.map(receipe => {
                        if (data.ID === receipe.data.ID) {
                            selectedClass = "selected";
                        }
                    });

                    return (
                        <tr key={key} className={selectedClass}>
                            <td><img src={XIVapi.getImgPathForIcon(data.Icon)}/></td>
                            <td>{data.Name}</td>
                            <td>{data.LevelItem}</td>
                            <td>{data.ClassJobCategory.Name_en ? data.ClassJobCategory.Name_en.split(" ").map(job => {
                                return <span className="btn-ico-job"><i
                                    className={XIVapi.getXivIconForJob(this.state.job_list[job] ? this.state.job_list[job].icon_number : "") + " "}
                                    title={this.state.job_list[job] ? this.state.job_list[job].label_fr : ""}/></span>
                            }) : ""}</td>
                            <td>
                                {(() => {
                                    if (data.EquipSlotCategory) {
                                        return Object.entries(data.EquipSlotCategory).map(slotInfo => {
                                            return slotInfo[1] == 1 ?
                                                <i className={XIVapi.getXivIconForSlot(slotInfo[0])}
                                                   style={{fontSize: '2em'}} title={this.slots[slotInfo[0]]}/>
                                                : " "

                                        });
                                    }
                                })()}
                            </td>
                            <td>
                                <button className="btn btn-primary btn-sm" onClick={() => {
                                    this.addToReceipe({data: data, id: data.GameContentLinks.Recipe.ItemResult})
                                }}><i className="xiv-app_payment_symbol"/> Ajouter
                                </button>
                            </td>
                        </tr>
                    )
                }
            ) : null

        return (
            <Tab eventKey={category}
                 disabled={!slotsFiltered || slotsFiltered.length == 0}
                 title={categoryName + (this.state.result_list ? ` (${slotsFiltered.length})` : ('\u00A0' + '\u00A0' + '\u00A0' + '\u00A0' + '\u00A0' + '\u00A0'))}>

                {this.state.result_list ?

                    <Table className="table table-striped  table-hover" variant="dark" size="sm">
                        <thead>
                        <tr>
                            <th>Icône</th>
                            <th>Nom</th>
                            <th>iLevel</th>
                            <th>Classe</th>
                            <th>Emplacement</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows}
                        <br/>
                        <br/>
                        </tbody>

                    </Table>
                    : null
                }
            </Tab>
        )
    };

    render() {

        return (
            <div className={"craft_search"}>
                <form onSubmit={this.search} className={"search form-inline"}>
                    <div className="form-group ">
                        <label htmlFor={'name'}> Nom :</label>
                        <input type='text' name={'search'} id={'search'} onChange={this.handleChange}
                               value={this.state.search}
                               className="form-control-sm"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor={'job'}> Classe :</label>
                        <Select name={'job'} id={'job'} onChange={this.handleChangeSelect} className="select2"
                                value={{value: this.state.job, label: this.state.job_list[this.state.job].label_fr}}
                                options={this.select2Jobs}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor={'lvl_min'}> Level mini :</label>
                        <input type='number' name={'lvl_min'} id={'lvl_min'} onChange={this.handleChange}
                               value={this.state.lvl_min}
                               className="form-control-sm ilvl"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor={'lvl_min'}> Level maxi :</label>
                        <input type='number' name={'lvl_max'} id={'lvl_max'} onChange={this.handleChange}
                               className="form-control-sm ilvl"
                               value={this.state.lvl_max}/>
                    </div>

                    <input type="submit" className={"btn btn-primary btn-sm"} value="Rechercher"/>
                </form>
                <div className="container-fluid">
                    <div className="row craft_result">
                        <div className="col-result col-sm-9">

                            {this.state.result_list ?
                                <Tabs defaultActiveKey="all" transition={false} id="noanim-tab-example">

                                    {this.renderRowResult('all', 'Tous')}


                                    {(() => {
                                        return Object.entries(this.slots).map(slotInfo => {

                                            return (this.renderRowResult(slotInfo[0], slotInfo[1]))
                                        });
                                    })()}


                                </Tabs>
                                :
                                <Image src={Bg} style={{width: '100%'}}/>
                            }

                        </div>

                        <div className="col-cart col-sm-3">
                            {
                                this.state.receipes.length > 0 ?
                                    <>
                                        <div className="header">
                                            <i className="xiv-MoogleBasket"/> Liste des équipements à craft
                                            ({this.state.receipes.length})
                                        </div>
                                        <div className="cart-lines">
                                            <table>
                                                {
                                                    this.state.receipes.map(receipe => {
                                                        return (

                                                            <tr>
                                                                <td><img
                                                                    src={XIVapi.getImgPathForIcon(receipe.data.Icon)}/>
                                                                </td>
                                                                <td> {receipe.qty}</td>
                                                                <td> {receipe.data.Name}</td>
                                                                <td>
                                                                    <button className="btn btn-primary btn-sm bordered"
                                                                            onClick={() => {
                                                                                this.removeReceipe(receipe);
                                                                            }}>
                                                                        <i className="xiv-DrawerDelete"/></button>
                                                                </td>
                                                            </tr>

                                                        )
                                                    })
                                                }
                                            </table>
                                        </div>
                                    </>
                                    :
                                    <div>
                                        <Ascii/>
                                    </div>

                            }


                        </div>

                    </div>
                </div>

                <div className="container-fluid list_ingredients">
                    <div className="col-xs-12 header">
                        Liste des ingrédients
                    </div>
                    {this.state.ingredient_list ?


                        <div className=" col-ingredient col-md-8">
                            <Table className="table table-striped  table-hover" variant="dark" size="sm">
                                <thead>
                                <tr>
                                    <th></th>
                                    <th>Qté</th>
                                    <th>Nom</th>
                                    <th>Emplacement</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.ingredient_list.map((data, key) => {
                                    return (
                                        <tr key={key}>

                                            <td><img src={XIVapi.getImgPathForIcon(data.Icon)}/></td>
                                            <td>{Math.ceil(data.qty)}</td>
                                            <td>{data.Name}</td>
                                            <td>
                                                {
                                                    (() => {
                                                        if (data.craft) {
                                                            return data.craft.map(craft => {
                                                                return <i className={XIVapi.getXivIconForSlot(craft)}
                                                                          style={{fontSize: '1.5em'}}/>
                                                            });
                                                        }
                                                    })()}
                                            </td>
                                            <td>
                                                <button className="btn btn-primary bordered btn-sm" onClick={() => {
                                                    this.getIngredientInfo(data)
                                                }}><i className="xiv-SymbolAlarmClock"/></button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </Table>
                        </div>

                        : null

                    }
                </div>

            </div>
        );
    }

}

export default EquipmentSearchForm;