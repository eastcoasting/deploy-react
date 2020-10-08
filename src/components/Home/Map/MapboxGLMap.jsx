import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Menu from 'react-burger-menu/lib/menus/slide'
import { FiLayers } from 'react-icons/fi';


import "../toggleStyles.css"
import "./sidebarStyles.css"
import "../accordionStyles.scss";
import "./legendStyle.css"
import Accordion from "../accordion";
import Layer from "./layer";
import Legend from "./Legend";


const styles = {
    width: "100vw",
    height: "93vh",
    top: "7.0vh",
    left: 0,
    bottom: "0vh",
    position: "absolute"
}



export const MapboxGLMap = ({
                                data,
                                getSelectedID,
                                colorBreaks,
                                highlightLineColor = { rgba: [255, 102, 0, 1] },
                            }) => {

    const mapContainer = useRef(null)
    const [statefulMap, setStatefulMap] = useState(null)

    const [ visibilityA, setVisibilityA]= useState('none')
    const [ sliderValueA, setSliderValueA ] = useState(100);
    const [ toTop, setToTop]= useState(null)


    const [ visibilityB, setVisibilityB]= useState('none')
    const [ sliderValueB, setSliderValueB ] = useState(100);


    const [ visibilityC, setVisibilityC]= useState('none')
    const [ sliderValueC, setSliderValueC ] = useState(100);

    const [ visibilityD, setVisibilityD]= useState('visible')
    const [ sliderValueD, setSliderValueD ] = useState(100);

    const [ visibilityE, setVisibilityE]= useState('none')
    const [ sliderValueE, setSliderValueE ] = useState(100);

    const [ visibilityF, setVisibilityF]= useState('none')
    const [ sliderValueF, setSliderValueF ] = useState(70);

    const [ visibilityG, setVisibilityG]= useState('none')
    const [ sliderValueG, setSliderValueG ] = useState(70);

    const landClassStyles = ['BioMass',
        '#fbb03b',
        'Paper Mill',
        '#223b53',
        'Multi Use',
        '#e55e5e',
        'Saw Mill',
        '#3bb2d0',
        'Unspecified',
        '#ccc']


    const landClassLegend = landClassStyles.reduce(function(result, value, index, array) {
        if (index % 2 === 0)
            result.push(array.slice(index, index + 2));
        return result;
    }, []);



    const ECLBreaks = [0,
        '#a1d99b',
        '1k',
        '#74C476',
        '100M',
        '#41AB5D',
        '150M',
        '#238B45',
        '500M',
        '#005A32'
    ];



    const ECLBreaksLegend = ECLBreaks.reduce(function(result, value, index, array) {
        if (index % 2 === 0)
            result.push(array.slice(index, index + 2));
        return result;
    }, []);








    const getFillColor = (colorBreaks) => {

        let fc = []
        fc.push('step')
        fc.push(['get', 'Shape_Area'])
        fc.push('rgba(0,0,0,0)')
        for (let colorBreak of colorBreaks) {
            fc.push(colorBreak.break)
            fc.push(`rgba(${colorBreak.rgba[0]}, ${colorBreak.rgba[1]}, ${colorBreak.rgba[2]},${colorBreak.rgba[3]})`)
        }

        return fc

    }


    const initMap = () => {

        mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuc3dpY2siLCJhIjoiY2l1dTUzcmgxMDJ0djJ0b2VhY2sxNXBiMyJ9.25Qs4HNEkHubd4_Awbd8Og'

        const mapboxGlMap = new mapboxgl.Map({
            container: mapContainer.current,
            style: `mapbox://styles/mapbox/outdoors-v11`,
            center: [-69.445500, 45.25380],
            zoom: 6.5
        })

        mapboxGlMap.addControl(new mapboxgl.NavigationControl())
        mapboxGlMap.addControl(new mapboxgl.FullscreenControl())

        mapboxGlMap.on("load", () => {


            mapboxGlMap.addLayer({
                id: "satellite",
                source: {"type": "raster",  "url": "mapbox://mapbox.satellite", "tileSize": 256},
                type: "raster",
            });

            mapboxGlMap.addSource('vernalPools', {
                type: 'geojson',
                data: 'https://services1.arcgis.com/RbMX0mRVOFNTdLzd/arcgis/rest/services/SVP/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson'
            });


                mapboxGlMap.addLayer({
                    id: 'vernalPools',
                    source: 'vernalPools',
                    sourceLayer: 'vernalPools-source-layer',
                    type: 'fill',
                    paint: {
                        'fill-color': 'rgba(200, 100, 240, 0.5)',
                        'fill-outline-color': 'rgba(200, 100, 240, 1)'
                    }
                })


            mapboxGlMap.addSource('conservedAreas', {
                type: 'geojson',
                data: 'https://gis.maine.gov/arcgis/rest/services/acf/Conserved_Lands/MapServer/0/query?outFields=*&where=1%3D1&f=geojson'
            });


            mapboxGlMap.addLayer({
                id: 'conservedAreas',
                source: 'conservedAreas',
                sourceLayer: 'conservedAreas-source-layer',
                type: 'fill',
                paint: {
                    'fill-color': 'rgba(200, 100, 240, 0.5)',
                    'fill-outline-color': 'rgba(200, 100, 240, 1)'
                }
            })


            mapboxGlMap.addLayer({
                "id": "landOwnership",
                "type": "raster",
                "minzoom": 0,
                "maxzoom": 22,
                "source": {
                    "type": "raster",
                    "tiles": ['https://apps.fs.usda.gov/arcx/rest/services/RDW_AdminAndOwnership/PublicPrivateForestOwnership_CONUS/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=EPSG%3A3857&dpi=96&format=png32&transparent=true&layers=show%3A0&f=image'],
                    "tileSize": 256
                }
            });



            mapboxGlMap.addSource('newMarketTaxCredits', {
                type: 'geojson',
                data: 'https://raw.githubusercontent.com/eastcoasting/test/master/newMarketTaxCredits.json'
            });



            mapboxGlMap.addLayer({
                id: 'newMarketTaxCredits',
                source: 'newMarketTaxCredits',
                sourceLayer: 'newMarketTaxCredits-layer',
                type: 'fill',
                paint: {
                    'fill-color': 'rgb(67,20,12)',
                    'fill-outline-color': 'rgb(34,15,6)'
                }
            })

            mapboxGlMap.addSource('qualifiedOpportunityZones', {
                type: 'geojson',
                data: 'https://raw.githubusercontent.com/eastcoasting/test/master/qualifiedOpportunityZones.json'
            });



            mapboxGlMap.addLayer({
                id: 'qualifiedOpportunityZones',
                source: 'qualifiedOpportunityZones',
                sourceLayer: 'qualifiedOpportunityZones-layer',
                type: 'fill',
                paint: {
                    'fill-color': 'rgb(12,67,21)',
                    'fill-outline-color': 'rgb(6,34,11)'
                }
            });




            mapboxGlMap.addSource('siteSelection', {
                type: 'geojson',
                data: 'https://raw.githubusercontent.com/eastcoasting/reactright/maine/src/components/Home/Plot/Data/siteSelection.json'
            });




            mapboxGlMap.addLayer({
                id: 'siteSelection',
                source: 'siteSelection',
                type: 'circle',
                'paint': {
                    'circle-radius': {
                        'base': 1.75,
                        'stops': [[12, 10], [22, 180]]

                    },
                    'circle-color': [
                        'match',
                        ['get', 'SiteType'],
                        'BioMass',
                        '#fbb03b',
                        'Paper Mill',
                        '#223b53',
                        'Multi Use',
                        '#e55e5e',
                        'Saw Mill',
                        '#3bb2d0',
                        '#ccc'
                    ]
                }
            });











            /*mapboxGlMap.addLayer({
                id: 'aoi-solid-line',
                source: 'conservedAreas',
                type: 'line',
                paint: {
                    'line-color': 'white',
                    'line-width': 2
                }
            })

            //lay down a transparent highlight line layer, we'll use this layer later to highlight a feature based on selectedId
            mapboxGlMap.addLayer({
                id: 'aoi-highlight',
                source: 'conservedAreas',
                type: 'line',
                paint: {
                    'line-color': `rgba(${highlightLineColor.rgba[0]},${highlightLineColor.rgba[1]},${highlightLineColor.rgba[2]}, 0)`,
                    'line-width': 3,
                }
            })*/


            ///////////////////////////////////////////////////////////

            // Change the cursor to a pointer when the mouse is over the layer.
            mapboxGlMap.on('mouseenter', 'siteSelection', function () {
                mapboxGlMap.getCanvas().style.cursor = 'pointer';
            });

            // Change it back to a pointer when it leaves.
            mapboxGlMap.on('mouseleave', 'siteSelection', function () {
                mapboxGlMap.getCanvas().style.cursor = '';
            });

            // When AOI is clicked
            mapboxGlMap.on('click', 'siteSelection', function (e) {
                //Popup
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML('<h5> ' + e.features[0].properties.Name + '</h5>'
                        + '<hr>' +
                        '<h6> Town/Zip: ' + e.features[0].properties.Town + ' (' + e.features[0].properties.ZipCode + ')' + '</h6>' +
                        '<hr>' +
                        '<h6> Lot Size (Acres): ' + e.features[0].properties.BrownfieldAcres + '</h6>'
                        + '<hr>' +
                        '<h6> Capacity: ' + e.features[0].properties.Capacity + '</h6>'
                        + '<hr>' +
                        '<h6> Notes: ' + e.features[0].properties.Notes + '</h6>'
                    )
                    .addTo(mapboxGlMap);
            });



            mapboxGlMap.on('click', 'qualifiedOpportunityZones', function (e) {
                    //Popup
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML('<h5> ' + e.features[0].properties.NAMELSAD + '</h5>'
                            + '<hr>' +
                            '<h6> County: ' + e.features[0].properties.County + '</h6>' +
                            '<hr>' +
                            '<h6> Tract Type: ' + e.features[0].properties.Tract_Type + '</h6>'
                        )
                        .addTo(mapboxGlMap);
                });

            mapboxGlMap.on('click', 'newMarketTaxCredits', function (e) {
                //Popup
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML('<h5> ' + e.features[0].properties.NAMELSAD + '</h5>'
                        + '<hr>' +
                        '<h6> County Name: ' + e.features[0].properties.County_Name + '</h6>'
                        + '<hr>' +
                        '<h6> Unemployment Rate: ' + e.features[0].properties.Census_Tract_Unemployment_Rate_____2011_2015 + '</h6>'

                    )
                    .addTo(mapboxGlMap);
            });


                /*         //Zoom in
                         const coordinates = e.features[0].geometry.coordinates[0];
                         const bounds = coordinates.reduce(function (bounds, coord) {
                             return bounds.extend(coord);
                         }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));


                         mapboxGlMap.fitBounds(bounds, {
                             padding: 100
                         });*/

                //color bounds
                // mapboxGlMap.setPaintProperty('aoi-highlight', 'line-color', [
                //     'case',
                //     ['==', ['get', 'id'], e.features[0].properties.id],
                //     `rgba(${highlightLineColor.rgba[0]},${highlightLineColor.rgba[1]},${highlightLineColor.rgba[2]},${highlightLineColor.rgba[3]})`,
                //     'rgba(0,0,0,0)'
                // ]);


            const layerStyles = mapboxGlMap.getStyle().layers

            console.log(layerStyles)


            setStatefulMap(mapboxGlMap)
            console.log('mapStateful set in state')
        })
    }


    useEffect(() => {


        if (!statefulMap) {
            initMap()
        } else {


            if (getSelectedID()) {
            //     console.log(`selectedId is not null, highlight selectedId: ${getSelectedID()}`)
            //     statefulMap.setPaintProperty('aoi-highlight', 'line-color', [
            //         'case',
            //         ['==', ['get', 'id'], parseInt(getSelectedID())],
            //         `rgba(${highlightLineColor.rgba[0]},${highlightLineColor.rgba[1]},${highlightLineColor.rgba[2]},${highlightLineColor.rgba[3]})`,
            //         'rgba(0,0,0,0)'
            //     ]);
            //
            //     const aoiFeatures = data.features.filter(feature => feature.properties.id === parseInt(getSelectedID()));
            //     const coordinates = (aoiFeatures[0].geometry.coordinates[0][0]);
            //     const bounds = coordinates.reduce(function (bounds, coord) {
            //         return bounds.extend(coord);
            //     }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
            //     statefulMap.fitBounds(bounds, {
            //         padding: 100
            //     });
            //
            // } else {
            //     statefulMap.setPaintProperty('aoi-highlight', 'line-color', 'rgba(0,0,0,0)')
            //     statefulMap.flyTo({center: [-69.445500, 45.25380], zoom: 6.5});
             }

        }

    }, [statefulMap,
        getSelectedID()
    ])




    useEffect(() => {

        if (!statefulMap) {
        } else {

            statefulMap.setLayoutProperty('vernalPools', 'visibility', `${visibilityA}`)
            statefulMap.setPaintProperty(
                'vernalPools',
                'fill-opacity',
                parseInt(`${sliderValueA}`, 10) / 100
            );
            if (toTop != null) {
                statefulMap.moveLayer(toTop);
            }


            statefulMap.setLayoutProperty('satellite', 'visibility', `${visibilityB}`)
            statefulMap.setPaintProperty(
                'satellite',
                'raster-opacity',
                parseInt(`${sliderValueB}`, 10) / 100
            );

            statefulMap.setLayoutProperty('conservedAreas', 'visibility', `${visibilityC}`)
            statefulMap.setPaintProperty(
                'conservedAreas',
                'fill-opacity',
                parseInt(`${sliderValueC}`, 10) / 100
            );


            statefulMap.setLayoutProperty('siteSelection', 'visibility', `${visibilityD}`)
            statefulMap.setPaintProperty(
                'siteSelection',
                'circle-opacity',
                parseInt(`${sliderValueD}`, 10) / 100
            );


            statefulMap.setLayoutProperty('landOwnership', 'visibility', `${visibilityE}`)
            statefulMap.setPaintProperty(
                'landOwnership',
                'raster-opacity',
                parseInt(`${sliderValueE}`, 10) / 100
            );


            statefulMap.setLayoutProperty('qualifiedOpportunityZones', 'visibility', `${visibilityF}`)
            statefulMap.setPaintProperty(
                'qualifiedOpportunityZones',
                'fill-opacity',
                parseInt(`${sliderValueF}`, 10) / 100
            );

            statefulMap.setLayoutProperty('newMarketTaxCredits', 'visibility', `${visibilityG}`)
            statefulMap.setPaintProperty(
                'newMarketTaxCredits',
                'fill-opacity',
                parseInt(`${sliderValueG}`, 10) / 100
            );




        }

    }, [statefulMap,
        visibilityA,
        visibilityB,
        visibilityC,
        visibilityD,
        visibilityE,
        visibilityF,
        visibilityG,
        sliderValueA,
        sliderValueB,
        sliderValueC,
        sliderValueD,
        sliderValueE,
        sliderValueF,
        sliderValueG,
        toTop

    ])




    return (
      <div>
          <div style={styles}
               ref={mapContainer}/>

          <div className={'legendBox'} >


              {(visibilityA === 'visible') ?

                  <Legend
                      legendLayerTitle={'Vernal Pools'}
                      itemArray={ECLBreaksLegend}
                      legendLayerFormat={'Area in m2'}
                      keyID={'vernalPools'}
                  />
                  :
                  null
              }


              {(
                  visibilityD === 'visible' ||
                  visibilityE === 'visible' ||
                  visibilityC === 'visible' ||
                  visibilityF === 'visible') ?

                  <Legend
                      legendLayerTitle={'Brownfield Sites'}
                      itemArray={landClassLegend}
                      keyID={'siteSelection'}
                  />
                  :
                  null
              }


          </div>

          <Menu customBurgerIcon={ <FiLayers /> } isOpen={ true } noOverlay={true}>
                  <Accordion title="Environment"
                             accordionOpen={false}
                  >

                          <Layer
                              layerTitle={'Vernal Pools'}
                              sourceDetails={'https://maine.hub.arcgis.com/datasets/478a139603884f718651f21c9dbf318c'}
                              layerDescription={'This dataset was developed in accordance with Maine\'s Natural Resources Protection Act (NRPA). Under this Act, the Maine Department of Inland Fisheries and Wildlife (MDIFW) is designated as the authority for determining Significant Wildlife Habitats (SWHs). This dataset includes all Significant Vernal Pools currently mapped. This dataset depicts 250-foot habitat zones surrounding the perimeters of Significant Vernal Pools (SVPs) or Potentially Significant Vernal Pools (PSVPs). SVPs and PSVPs were mapped and surveyed in the field by Maine Department of Environmental Protection staff, Maine Department of Inland Fisheries and Wildlife biologists, and appropriately trained consultants.'}
                              defaultChecked={false}
                              onToggleChange={ (e) => {
                                  if(e.target.checked === false) {
                                      setVisibilityA('none')
                                  }
                                  else {
                                      setVisibilityA('visible')
                                  }
                              }}
                              onSliderChange={(e) => setSliderValueA(e.target.value)}
                              sliderChangeValue={sliderValueA}
                              layerToTop={ () => {
                                  setToTop('vernalPools')
                              }}
                          />

                      <Layer
                          layerTitle={'Satellite'}
                          sourceDetails={'Indufor 2020'}
                          layerDescription={'Mapbox Satellite'}
                          defaultChecked={false}
                          onToggleChange={ (e) => {
                              if(e.target.checked === false) {
                                  setVisibilityB('none')
                              }
                              else {
                                  setVisibilityB('visible')
                              }
                          }}
                          onSliderChange={(e) => setSliderValueB(e.target.value)}
                          sliderChangeValue={sliderValueB}
                          layerToTop={ () => {
                              setToTop('satellite')
                          }}
                      />
                  </Accordion>

              <Accordion title="Woodbasket"
                         accordionOpen={false}
              >
                  <Layer
                      layerTitle={'Conserved Lands'}
                      sourceDetails={'https://maine.hub.arcgis.com/datasets/a6797f12a07b4229bc2501d3741c98d4'}
                      layerDescription={'Conserved Lands contains conservation lands ownership boundaries at 1:24,000 scale for Maine land in federal, state, municipal and non-profit ownership with easements. State, county, town, and coast boundary data were obtained from MEGIS town boundary dataset METWP24. 1:24,000 US Geological Survey (USGS) digital line graph data was used for hydrography and transportation features. Where state, county, and town boundaries were coincident with property boundaries, the coincident features were taken from METWP24. Where hydrography, roads, railroads and power-lines were coincident with property boundaries, the coincident features were taken from 1:24,000 digital line graph data. The ownership lines do not represent legal boundaries nor are the ownership lines a survey. Conserved Lands is an inventory of approximate property boundaries.'}
                      defaultChecked={false}
                      onToggleChange={ (e) => {
                          if(e.target.checked === false) {
                              setVisibilityC('none')
                          }
                          else {
                              setVisibilityC('visible')
                          }
                      }}
                      onSliderChange={(e) => setSliderValueC(e.target.value)}
                      sliderChangeValue={sliderValueC}
                      layerToTop={ () => {
                          setToTop('conservedAreas')
                      }}
                  />

                  <Layer
                      layerTitle={'Forest Ownership'}
                      sourceDetails={'https://usfs.maps.arcgis.com/home/item.html?id=0cc2cb942455475ca781fda25028ef2f'}
                      layerDescription={'The data are designed for strategic analyses at a national or regional scale which require spatially explicit information regarding the extent, distribution, and prevalence of the ownership types represented. The data are not recommended for tactical analyses on a sub-regional scale, or for informing local management decisions. Furthermore, map accuracies vary considerably and thus the utility of these data can vary geographically under different ownership patterns.'}
                      defaultChecked={false}
                      onToggleChange={ (e) => {
                          if(e.target.checked === false) {
                              setVisibilityE('none')
                          }
                          else {
                              setVisibilityE('visible')
                          }
                      }}
                      onSliderChange={(e) => setSliderValueE(e.target.value)}
                      sliderChangeValue={sliderValueE}
                      layerToTop={ () => {
                          setToTop('landOwnership')
                      }}
                  />

              </Accordion>

              <Accordion title="Maine's Forest Economy"
                         accordionOpen={true}
              >

                  <Layer
                      layerTitle={'Brownfield Sites'}
                      sourceDetails={'Indufor 2020'}
                      layerDescription={'2010 Classes'}
                      defaultChecked={true}
                      onToggleChange={ (e) => {
                          if(e.target.checked === false) {
                              setVisibilityD('none')
                          }
                          else {
                              setVisibilityD('visible')
                          }
                      }}
                      onSliderChange={(e) => setSliderValueD(e.target.value)}
                      sliderChangeValue={sliderValueD}
                      layerToTop={ () => {
                          setToTop('siteSelection')
                      }}
                  />

                  <Layer
                      layerTitle={'Qualified Opportunity Zones'}
                      sourceDetails={'https://www.maine.gov/decd/business-development/opportunity-zones'}
                      layerDescription={'The Opportunity Zones incentive is a community investment tool established by Congress in the Tax Cuts and Jobs Act of 2017 to encourage long-term investments in low-income urban and rural communities nationwide. Opportunity Zones provide a tax incentive for investors to re-invest their unrealized capital gains into dedicated Opportunity Funds.'}
                      defaultChecked={false}
                      onToggleChange={ (e) => {
                          if(e.target.checked === false) {
                              setVisibilityF('none')
                          }
                          else {
                              setVisibilityF('visible')
                          }
                      }}
                      onSliderChange={(e) => setSliderValueF(e.target.value)}
                      sliderChangeValue={sliderValueF}
                      layerToTop={ () => {
                          setToTop('qualifiedOpportunityZones')
                      }}
                  />

                  <Layer
                      layerTitle={'New Market Tax Credit'}
                      sourceDetails={'https://www.maine.gov/decd/business-development/opportunity-zones'}
                      layerDescription={'The Opportunity Zones incentive is a community investment tool established by Congress in the Tax Cuts and Jobs Act of 2017 to encourage long-term investments in low-income urban and rural communities nationwide. Opportunity Zones provide a tax incentive for investors to re-invest their unrealized capital gains into dedicated Opportunity Funds.'}
                      defaultChecked={false}
                      onToggleChange={ (e) => {
                          if(e.target.checked === false) {
                              setVisibilityG('none')
                          }
                          else {
                              setVisibilityG('visible')
                          }
                      }}
                      onSliderChange={(e) => setSliderValueG(e.target.value)}
                      sliderChangeValue={sliderValueG}
                      layerToTop={ () => {
                          setToTop('newMarketTaxCredits')
                      }}
                  />

              </Accordion>

          </Menu>


      </div>


    )
}

