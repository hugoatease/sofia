import { useContext } from "react";
import { CastContext } from "contexts";
import { MQTT_URL, OWM_KEY, WEATHER_LAT, WEATHER_LON } from "./constants";

export const useConfig = () => {
  const { config: castConfig = {} } = useContext(CastContext);
  return {
    mqttUrl: castConfig.mqttUrl || MQTT_URL,
    owmKey: OWM_KEY,
    weatherLat: castConfig.weatherLat || WEATHER_LAT,
    weatherLon: castConfig.weatherLon || WEATHER_LON,
  };
};
