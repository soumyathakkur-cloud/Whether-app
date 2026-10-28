import test from 'node:test';
import assert from 'node:assert/strict';
import {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  formatTemperature,
  formatWindSpeed,
  getWindDirectionLabel,
  getUvIndexInfo,
  getAirQualityInfo,
  getWeatherCondition,
  formatPressure,
  formatVisibility,
} from './weatherUtils';

test('celsiusToFahrenheit converts temperatures accurately', () => {
  assert.equal(celsiusToFahrenheit(0), 32);
  assert.equal(celsiusToFahrenheit(100), 212);
  assert.equal(celsiusToFahrenheit(-40), -40);
  assert.equal(Math.round(celsiusToFahrenheit(20)), 68);
});

test('fahrenheitToCelsius converts backwards accurately', () => {
  assert.equal(fahrenheitToCelsius(32), 0);
  assert.equal(fahrenheitToCelsius(212), 100);
});

test('formatTemperature handles both C and F with rounding', () => {
  assert.equal(formatTemperature(21.4, 'C'), '21°C');
  assert.equal(formatTemperature(21.4, 'F'), '71°F');
  assert.equal(formatTemperature(20, 'C', false), '20°');
});

test('formatWindSpeed converts km/h to mph when unit is F', () => {
  assert.equal(formatWindSpeed(20, 'C'), '20 km/h');
  assert.equal(formatWindSpeed(20, 'F'), '12 mph');
});

test('getWindDirectionLabel calculates compass headings accurately', () => {
  assert.equal(getWindDirectionLabel(0), 'N');
  assert.equal(getWindDirectionLabel(360), 'N');
  assert.equal(getWindDirectionLabel(90), 'E');
  assert.equal(getWindDirectionLabel(180), 'S');
  assert.equal(getWindDirectionLabel(270), 'W');
  assert.equal(getWindDirectionLabel(45), 'NE');
  assert.equal(getWindDirectionLabel(225), 'SW');
});

test('getUvIndexInfo categorizes UV levels correctly', () => {
  assert.equal(getUvIndexInfo(1).level, 'Low');
  assert.equal(getUvIndexInfo(4).level, 'Moderate');
  assert.equal(getUvIndexInfo(7).level, 'High');
  assert.equal(getUvIndexInfo(9).level, 'Very High');
  assert.equal(getUvIndexInfo(12).level, 'Extreme');
});

test('getAirQualityInfo provides meaningful status for ranges', () => {
  assert.equal(getAirQualityInfo(15).status, 'Good');
  assert.equal(getAirQualityInfo(35).status, 'Fair');
  assert.equal(getAirQualityInfo(55).status, 'Moderate');
  assert.equal(getAirQualityInfo(75).status, 'Poor');
  assert.equal(getAirQualityInfo(95).status, 'Very Poor');
});

test('getWeatherCondition maps WMO codes correctly', () => {
  const clearDay = getWeatherCondition(0, true);
  assert.equal(clearDay.type, 'clear-day');
  assert.equal(clearDay.isRain, false);

  const clearNight = getWeatherCondition(0, false);
  assert.equal(clearNight.type, 'clear-night');

  const rain = getWeatherCondition(61, true);
  assert.equal(rain.isRain, true);
  assert.equal(rain.type, 'rain');

  const storm = getWeatherCondition(95, true);
  assert.equal(storm.isRain, true);
  assert.equal(storm.type, 'thunderstorm');
});

test('formatPressure formats hPa and inHg correctly', () => {
  assert.equal(formatPressure(1013, 'C'), '1013 hPa');
  assert.equal(formatPressure(1013, 'F'), '29.91 inHg');
});

test('formatVisibility formats meters to km and miles', () => {
  assert.equal(formatVisibility(10000, 'C'), '10.0 km');
  assert.equal(formatVisibility(10000, 'F'), '6.2 mi');
});
