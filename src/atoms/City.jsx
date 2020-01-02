import React from "react";
import { connect } from "react-redux";
import Color from "../data/Color";

import Name from "./Name";

import findIndex from "ramda/src/findIndex";
import is from "ramda/src/is";
import propEq from "ramda/src/propEq";
import Token from "../Token";

import Config from "../data/Config";
import ColorContext from "../context/ColorContext";
import RotateContext from "../context/RotateContext";

import { compileCompanies } from "../util";

const City = ({ straightCityNames, size, companies, border, name, extend, rotation, pass, bgColor }) => {
  if (size === undefined) {
    size = 1;
  }

  let companyColor = num =>
      (companies &&
       companies[num] &&
       companies[num].color);

  let companyLabel = num => {
    if(companies && companies[num]) {
      if(is(Object, companies[num])) {
        return (
          <RotateContext.Consumer>
            {rotateContext => (
              <g transform={`rotate(${-(rotateContext || 0) - (rotation || 0)})`}>
                <ColorContext.Provider value="companies">
                  <Config>
                    {(config, game) => {
                      if(config.plainMapHomes) {
                        return <Token label={companies[num].label} token="white"/>;
                      } else {
                        return <Token label={companies[num].label} logo={companies[num].logo || companies[num].label} token={companies[num].token || companies[num].color}/>;
                      }
                    }}
                  </Config>
                </ColorContext.Provider>
              </g>
            )}
          </RotateContext.Consumer>
        );
      } else {
        return (
          <RotateContext.Consumer>
            {rotateContext => (
              <g transform={`rotate(${-(rotateContext || 0) - (rotation || 0)})`}>
                <ColorContext.Provider value="companies">
                  <Config>
                    {(config, game) => {
                      let gameCompanies = compileCompanies(game, config.overrideCompanies, config.overrideSelection);
                      let companyIndex = findIndex(propEq("abbrev", companies[num]), game.companies);
                      let company = gameCompanies[companyIndex];

                      if(config.plainMapHomes) {
                        return <Token label={company.label} token="white"/>;
                      } else {
                        if(company) {
                          return <Token label={company.abbrev} logo={company.logo || company.abbrev} token={company.color || company.token}/>;
                        } else {
                          return null;
                        }
                      }
                    }}
                  </Config>
                </ColorContext.Provider>
              </g>
            )}
          </RotateContext.Consumer>
        );
      }
    }

    return null;
  };

  let nameNode = null;

  if (name) {
    let path = straightCityNames ? null : `city${size > 1 ? size : ""}Path`;
    if(path && name.reverse) {
      path = path + "Reverse";
    }
    let y = name.y || (name.reverse ? 7 : 0);
    if (straightCityNames) {
      y -= name.reverse ? -24 : 32;
    }
    nameNode = <Name bgColor={bgColor} {...name} y={y} path={path} />;
  }

  if (size === 1) {
    if (border) {
      return (
        <Color>
          {c => (
            <g>
              {pass && <polygon
                          fill={c("border")}
                          stroke="none"
                          points="0,-46 -39.83716857,23 39.83716857,23"
                          />}
              <circle fill={c("border")} stroke="none" cx="0" cy="0" r="28" />
            </g>
          )}
        </Color>
      );
    } else {
      return (
        <g>
          <Color context="companies">
            {c => (
              <g>
                {pass && <polygon
                          fill={c("gray")}
                          stroke={c("track")}
                          strokeWidth="2"
                          points="0,-40 -34.64101615,20 34.64101615,20"
                        />}
                <circle
                  fill={c(companyColor(0) || "city")}
                  stroke="none"
                  cx="0"
                  cy="0"
                  r="25"
                />
              </g>
            )}
          </Color>
          {companyLabel(0)}
          <Color context="companies">
            {c => (
              <circle
                fill="none"
                stroke={c("track")}
                strokeWidth="2"
                cx="0"
                cy="0"
                r="25"
              />
            )}
          </Color>
          {nameNode}
        </g>
      );
    }
  } else if (size === 2) {
    let leftBorder = extend === "left" ? -55 : -25;
    let rightBorder = extend === "right" ? 55 : 25;
    if (border) {
      return (
        <Color>
          {c => (
            <g>
              {pass && <polygon
                            fill={c("border")}
                            stroke="none"
                            points="0,-48 -48.49742261,35 48.49742261,35"
                    />}
              <polygon
                points={`${leftBorder},0 ${rightBorder},0`}
                fill={c("border")}
                stroke={c("border")}
                strokeWidth="56"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </g>
          )}
        </Color>
      );
    } else {
      return (
        <Color context="companies">
          {c => (
            <g>
              {pass && <polygon
                          fill={c("gray")}
                          stroke={c("track")}
                          strokeWidth="2"
                          points="0,-42 -43.30127019,32 43.30127019,32"
                        />}
              <polygon
                points={`${leftBorder},-25, ${rightBorder},-25 ${rightBorder},25 ${leftBorder},25`}
                fill={c("city")}
                stroke={c("track")}
                strokeWidth="2"
              />
              <g transform="translate(-25 0)">
                <circle
                  fill={c(companyColor(0) || "city")}
                  stroke="none"
                  r="25"
                />
                {companyLabel(0)}
                <circle
                  fill="none"
                  stroke={c("track")}
                  strokeWidth="2"
                  r="25"
                />
              </g>
              <g transform="translate(25 0)">
                <circle
                  fill={c(companyColor(1) || "city")}
                  stroke="none"
                  r="25"
                />
                {companyLabel(1)}
                <circle
                  fill="none"
                  stroke={c("track")}
                  strokeWidth="2"
                  r="25"
                />
              </g>
              {nameNode}
            </g>
          )}
        </Color>
      );
    }
  } else if (size === 3) {
    if (border) {
      return (
        <Color>
          {c => (
            <polygon
              points="0,-29 25,15 -25,15"
              fill={c("border")}
              stroke={c("border")}
              strokeWidth="56"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
        </Color>
      );
    } else {
      return (
        <Color context="companies">
          {c => (
            <g>
              <polygon
                points="-21,-42, 21,-42 45,-1 25,40 -25,40 -45,-1"
                fill={c("city")}
                stroke={c("track")}
                strokeWidth="2"
              />
              <g transform="translate(0 -29)">
                <circle
                  fill={c(companyColor(0) || "city")}
                  stroke="none"
                  r="25"
                />
                {companyLabel(0)}
                <circle
                  fill="none"
                  stroke={c("track")}
                  strokeWidth="2"
                  r="25"
                />
              </g>
              <g transform="translate(-25 15)">
                <circle
                  fill={c(companyColor(1) || "city")}
                  stroke="none"
                  r="25"
                />
                {companyLabel(1)}
                <circle
                  fill="none"
                  stroke={c("track")}
                  strokeWidth="2"
                  r="25"
                />
              </g>
              <g transform="translate(25 15)">
                <circle
                  fill={c(companyColor(2) || "city")}
                  stroke="none"
                  r="25"
                />
                {companyLabel(2)}
                <circle
                  fill="none"
                  stroke={c("track")}
                  strokeWidth="2"
                  r="25"
                />
              </g>
              {nameNode}
            </g>
          )}
        </Color>
      );
    }
  } else if (size === 4) {
    if (border) {
      return (
        <Color>
          {c => (
            <polygon
              points="-25,-25 25,-25 25,25 -25,25"
              fill={c("border")}
              stroke={c("border")}
              strokeWidth="56"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
        </Color>
      );
    } else {
      return (
        <Color context="companies">
          {c => (
            <g>
              <polygon
                points="-25,-50, 25,-50 50,-25 50,25 25,50 -25,50 -50,25 -50,-25"
                fill={c("city")}
                stroke={c("track")}
                strokeWidth="2"
              />
              <g transform="translate(-25 -25)">
                <circle
                  fill={c(companyColor(0) || "city")}
                  stroke="none"
                  r="25"
                />
                {companyLabel(0)}
                <circle
                  fill="none"
                  stroke={c("track")}
                  strokeWidth="2"
                  r="25"
                />
              </g>
              <g transform="translate(25 -25)">
                <circle
                  fill={c(companyColor(1) || "city")}
                  stroke="none"
                  r="25"
                />
                {companyLabel(1)}
                <circle
                  fill="none"
                  stroke={c("track")}
                  strokeWidth="2"
                  r="25"
                />
              </g>
              <g transform="translate(25 25)">
                <circle
                  fill={c(companyColor(3) || "city")}
                  stroke="none"
                  r="25"
                />
                {companyLabel(3)}
                <circle
                  fill="none"
                  stroke={c("track")}
                  strokeWidth="2"
                  r="25"
                />
              </g>
              <g transform="translate(-25 25)">
                <circle
                  fill={c(companyColor(2) || "city")}
                  stroke="none"
                  r="25"
                />
                {companyLabel(2)}
                <circle
                  fill="none"
                  stroke={c("track")}
                  strokeWidth="2"
                  r="25"
                />
              </g>
            </g>
          )}
        </Color>
      );
    }
  } else {
    return null;
  }
};

const mapStateToProps = state => ({
  straightCityNames: state.config.straightCityNames
});

export default connect(mapStateToProps)(City);
