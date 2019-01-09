import React from "react";
import util from "./util";
import * as R from "ramda";

import Position from "./Position";

import HexContext from "./context/HexContext";

import Border from "./atoms/Border";
import Bridge from "./atoms/Bridge";
import CenterTown from "./atoms/CenterTown";
import City from "./atoms/City";
import Company from "./atoms/Company";
import Divide from "./atoms/Divide";
import Good from "./atoms/Good";
import Hex from "./atoms/Hex";
import Icon from "./atoms/Icon";
import Id from "./atoms/Id";
import Industry from "./atoms/Industry";
import Label from "./atoms/Label";
import Name from "./atoms/Name";
import OffBoardRevenue from "./atoms/OffBoardRevenue";
import OffBoardTrack from "./atoms/OffBoardTrack";
import RouteBonus from "./atoms/RouteBonus";
import Terrain from "./atoms/Terrain";
import Town from "./atoms/Town";
import TownCity from "./atoms/TownCity";
import Track from "./atoms/Track";
import Tunnel from "./atoms/Tunnel";
import Value from "./atoms/Value";

import Token from "./Token";

const concat = R.unapply(R.reduce(R.concat, []));

const makeOffBoardTrack = track => {
  let side = track.side;
  let rotation = (track.rotation || 0) + (side - 1) * 60;
  let transform = `rotate(${rotation || 0})`;
  return (
    <g transform={transform} key={`offboard-${side}`}>
      <OffBoardTrack border={true} />
      <OffBoardTrack />
    </g>
  );
};

const makeTrack = track => {
  let point = track.start || track.end || track.side;
  let rotation = (track.rotation || 0) + (point - 1) * 60;
  let transform = `rotate(${rotation || 0})`;
  let type = track.type || util.trackType(track);
  return (
    <g transform={transform} key={`track-${type}-${point}`}>
      <Track type={type} gauge={track.gauge} offset={track.offset} />
    </g>
  );
};

const makeBorder = track => {
  let point = track.start || track.end || track.side;
  let rotation = (track.rotation || 0) + (point - 1) * 60;
  let transform = `rotate(${rotation || 0})`;
  let type = track.type || util.trackType(track);
  return (
    <g transform={transform} key={`track-board-${type}-${point}`}>
      <Track
        type={track.type || util.trackType(track)}
        gauge={track.gauge}
        border={true}
      />
    </g>
  );
};

const HexTile = ({ hex, id, border, transparent }) => {
  if (hex === undefined || hex === null) {
    return null;
  }

  let [idBase, idExtra] = (id || "").split("|");

  let getTracks = R.converge(concat, [
    R.compose(
      R.map(makeBorder),
      R.filter(t => t.cross !== "over")),
    R.compose(
      R.map(makeTrack),
      R.filter(t => t.cross === "under")),
    R.compose(
      R.map(makeBorder),
      R.filter(t => t.cross === "over")),
    R.compose(
      R.map(makeTrack),
      R.filter(t => t.cross !== "under"))
  ]);

  let tracks = getTracks(hex.track || []);
  let offBoardTracks = R.map(makeOffBoardTrack, hex.offBoardTrack || []);

  let outsideCities = (
    <Position data={R.filter(c => c.outside === true, hex.cities || [])}>
      {c => <City {...c} />}
    </Position>
  );
  let cities = (
    <Position data={R.filter(c => c.outside !== true, hex.cities || [])}>
      {c => <City {...c} />}
    </Position>
  );

  let outsideCityBorders = (
    <Position data={R.filter(c => c.outside === true, hex.cities || [])}>
      {c => <City {...c} border={true} />}
    </Position>
  );
  let cityBorders = (
    <Position data={R.filter(c => c.coutside !== true, hex.cities || [])}>
      {c => <City {...c} border={true} />}
    </Position>
  );

  let towns = <Position data={hex.towns}>{t => <Town {...t} />}</Position>;
  let townBorders = <Position data={hex.towns}>{t => <Town {...t} border={true} />}</Position>;

  let centerTowns = <Position data={hex.centerTowns}>{t => <CenterTown {...t} />}</Position>;
  let centerTownBorders = <Position data={hex.centerTowns}>{t => <CenterTown border={true} />}</Position>;

  let townCities = <Position data={hex.townCities}>{t => <TownCity {...t} />}</Position>;
  let townCityBorders = <Position data={hex.townCities}>{t => <TownCity border={true} />}</Position>;

  let labels = <Position data={hex.labels}>{l => <Label {...l} />}</Position>;
  let icons = <Position data={hex.icons}>{i => <Icon {...i} />}</Position>;
  let names = <Position data={hex.names}>{n => <Name {...n} />}</Position>;

  // Deprecating stuff... let's convert old mountain and water to new format
  let terrainHexes = [...(hex.terrain || [])];
  if(hex.mountain) {
    if(R.is(Array, hex.mountain)) {
      terrainHexes.concat(R.map(m => ({...m,type:"mountain"}),
                                             hex.mountain));
    } else {
      terrainHexes.push({...hex.mountain, type:"mountain"});
    }
  }
  if(hex.water) {
    if(R.is(Array, hex.water)) {
      terrainHexes = terrainHexes.concat(R.map(m => ({...m,type:"water"}),
                                             hex.water));
    } else {
      terrainHexes.push({...hex.water,type:"water"});
    }
  }
  let terrain = <Position data={terrainHexes}>{t => <Terrain {...t} />}</Position>;
  let bridges = <Position data={hex.bridges}>{b => <Bridge {...b} />}</Position>;
  let tunnels = <Position data={hex.tunnels}>{t => <Tunnel {...t} />}</Position>;
  let divides = <Position data={hex.divides}>{t => <Divide />}</Position>;

  let offBoardRevenue = <Position data={hex.offBoardRevenue}>
                          {r => <OffBoardRevenue {...r} />}
                        </Position>;

  let borders = <Position data={hex.borders}>{b => <Border {...b} />}</Position>;
  let values = <Position data={hex.values}>{v => <Value {...v} />}</Position>;
  let industries = <Position data={hex.industries}>{i => <Industry {...i} />}</Position>;
  let goods = <Position data={hex.goods}>{g => <Good {...g} />}</Position>;
  let companies = <Position data={hex.companies}>{c => <Company {...c} />}</Position>;
  let tokens = <Position data={hex.tokens}>{t => <Token {...t} />}</Position>;
  let bonus = <Position data={hex.routeBonus}>{b => <RouteBonus {...b} />}</Position>;

  return (
    <g>
      <Hex color={hex.color || "plain"} transparent={transparent} />

      <HexContext.Consumer>
        {hx => (
          <g clipPath="url(#hexClip)" transform={`rotate(${hx.rotation || 0})`}>
            <g transform={`rotate(-${hx.rotation})`}>
              {icons}
              {cityBorders}
              {townCityBorders}
              {townBorders}
              {tracks}
              {offBoardTracks}
              {values}
              {cities}
              {townCities}
              {towns}
              {centerTownBorders}
              {centerTowns}
              {labels}
              {names}
              {tokens}
              {bonus}
              {offBoardRevenue}
              {terrain}
              {divides}
              {borders}
            </g>
          </g>
        )}
      </HexContext.Consumer>

      {border && <Hex border={true} />}
      {outsideCityBorders}

      {id && <Id id={idBase} extra={idExtra} />}

      {outsideCities}
      {offBoardRevenue}
      {industries}
      {goods}
      {companies}

      {tunnels}
      {bridges}
    </g>
  );
};

export default HexTile;
