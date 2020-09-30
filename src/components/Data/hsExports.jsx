import React, {useRef, useState, useEffect, setState} from "react";
import Plotly from "plotly.js"

import createPlotlyComponent from 'react-plotly.js/factory';
import {useQuery} from "react-query";
import census from "citysdk";

const Plot = createPlotlyComponent(Plotly);



export const PlotHSExports = ({
                            heightP,
                            widthP,
                            barColorInput,
                            onClick
                        }) => {



    const dataChartNode = useRef();


    function censusPromise(args) {
        return new Promise(function(resolve, reject) {
            census(args, function(err, json) {
                if (!err) {
                    resolve(json);
                } else {
                    reject(err);
                }
            });
        });
    }


    function getCensusExportsI() {
        return censusPromise({
            vintage: "timeseries", // required
            sourcePath: ["intltrade", "exports", "statehs"], // required
            values: ["CTY_CODE", "CTY_NAME", "ALL_VAL_MO"],
            predicates: {STATE:"ME", time: "from+2013-04", E_COMMODITY: "4701", CTY_CODE: "0003" },
            statsKey: "a019e5781e0a1ae25a17230a2e4404585c4ac414"
        })
    }

    function getCensusExportsII() {
        return censusPromise({
            vintage: "timeseries", // required
            sourcePath: ["intltrade", "exports", "statehs"], // required
            values: ["CTY_CODE", "CTY_NAME", "ALL_VAL_MO"],
            predicates: {STATE:"ME", time: "from+2013-04", E_COMMODITY: "0025" },
            statsKey: "a019e5781e0a1ae25a17230a2e4404585c4ac414"
        })
    }

    function getCensusExportsIII() {
        return censusPromise({
            vintage: "timeseries", // required
            sourcePath: ["intltrade", "exports", "statehs"], // required
            values: ["CTY_CODE", "CTY_NAME", "ALL_VAL_MO"],
            predicates: {STATE:"ME", time: "from+2013-04", E_COMMODITY: "4401" },
            statsKey: "a019e5781e0a1ae25a17230a2e4404585c4ac414"
        })
    }

    function getAllExports() {
        return Promise.all([getCensusExportsI(), getCensusExportsII(), getCensusExportsIII()])
            .then(data => data);
    }



    const { data } = useQuery('HSExports', getAllExports);

    const [stateXSawmills, setStateXSawmills] = React.useState([])
    const [stateYSawmills, setStateYSawmills] = React.useState([])
    const setDataTableXSawmills = [];
    const setDataTableYSawmills = [];

    const [stateXVeneer, setStateXVeneer] = React.useState([])
    const [stateYVeneer, setStateYVeneer] = React.useState([])
    const setDataTableXVeneer = [];
    const setDataTableYVeneer = [];


    const [stateXOther, setStateXOther] = React.useState([])
    const [stateYOther, setStateYOther] = React.useState([])
    const setDataTableXOther = [];
    const setDataTableYOther = [];

    React.useEffect(() => {

        if (!data) {
        } else {
            const [Sawmills, Other, Veneer] = data;

            if (data) {

                for (var key in Sawmills) {
                    setDataTableYSawmills.push(Sawmills[key].time);
                    setDataTableXSawmills.push(Sawmills[key].ALL_VAL_MO);

                }
                setStateXSawmills(setDataTableXSawmills);
                setStateYSawmills(setDataTableYSawmills);
                console.log(setDataTableYSawmills)



                for (var key in Veneer) {
                    setDataTableYVeneer.push(Veneer[key].time);
                    setDataTableXVeneer.push(Veneer[key].ALL_VAL_YR);

                }

                setStateXVeneer(setDataTableXVeneer);
                setStateYVeneer(setDataTableYVeneer);

                for (var key in Other) {
                    setDataTableYOther.push(Other[key].time);
                    setDataTableXOther.push(Other[key].ALL_VAL_YR);

                }

                setStateXOther(setDataTableXOther);
                setStateYOther(setDataTableYOther);
            }
        }
    }, [data])




    const chartData = [
        {
            x: stateYSawmills,
            y: stateXSawmills,
            type: 'scatter',
            name: 'Sawmills and wood<br>preservation',
            marker: {color: barColorInput},
            showlegend: true
        },
        {
            x: stateYVeneer,
            y: stateXVeneer,
            type: 'scatter',
            name: 'Veneer, plywood and<br>engineered wood product<br>manufacturing',
            marker: {color: barColorInput},
            showlegend: true
        },
        {
            x: stateYOther,
            y: stateXOther,
            type: 'scatter',
            name: 'Other wood product<br>manufacturing',
            marker: {color: barColorInput},
            showlegend: true
        }
    ];




    return (


        <div className={"PlotHSExports"}
             style={{width: '50%'}}>


            <Plot
                ref={dataChartNode}
                data={chartData}
                layout={{
                    height: heightP,
                    width: widthP,
                    title: 'Monthly Maine Wood Product Manufacturing Exports by NACIS Code',
                    legend: {
                        orientation: "v"
                    },
                    yaxis: {
                        title: "Export Sum (USD)",
                        rangemode: 'tozero'},

                }}
                config={{
                    displaylogo: false,
                    // displayModeBar: true,
                    modeBarButtonsToRemove: [
                        "lasso2d",
                        "autoScale2d", // 2D options
                        "toggleSpikelines",
                        "zoom2d",
                        "zoomIn2d",
                        "zoomOut2d",
                        "pan2d",
                        "hoverClosestCartesian",
                        "hoverCompareCartesian"
                    ],
                    responsive: true,
                    // scrollZoom,
                    showTips: false
                }}
            />
        </div>


    );
}