import React from "react";

import Collapsible from 'react-collapsible';
import { AiOutlineLineChart } from 'react-icons/ai';





export const PlotlyBarComponent = ({
                             }) => {


    return (

        <div className={"plot"} >
            <Collapsible  trigger={<AiOutlineLineChart
                          className={'chartIcon'}
                          size="40px" />}
                          open ={false}
            >
                <div>This</div>


            </Collapsible>
        </div>


    );
}