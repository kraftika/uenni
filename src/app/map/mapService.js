'use strict';

angular.module('founders')
  .factory('mapService', ['$q', function($q) {

    var markersList = [];
    var markerColumns = [];
    var map;
    var geocoder;

    function _initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 42.877742, lng: -97.380979 },
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        mapTypeControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        }
      });

      geocoder = new google.maps.Geocoder();
    }

    function _showMarker(founderId) {
      if (founderId) {
        _.each(markersList, function(marker) {
          if (marker.id === founderId) {
            marker.setMap(map);
          }
        });
      }
    }

    function _hideMarker(founderId) {
      if (founderId) {
        _.each(markersList, function(marker) {
          if (marker.id === founderId) {
            marker.setMap(null);
          }
        });
      }
    }

    function _isAnyMarkerColumnSet() {
      return markerColumns.length > 0;
    }

    function _removeAllMarkersOnMap() {
      markersList.forEach(function(item) {
        item.setMap(null);
      });
      markersList.length = [];
    }

    function _addColumnToAddress(element, stringAddress, column) {
      if (!stringAddress) {
        stringAddress = '';
      }

      if (column) {
        if (stringAddress && element[column]) {
          stringAddress += ', ';
        }

        if (element[column]) {
          stringAddress += element[column];
        }
      }

      return stringAddress;
    }

    function _getAddressFor(founder) {
      var address;

      markerColumns.forEach(function(column) {
        address = _addColumnToAddress(founder, address, column);
      });

      return address;
    }

    function _getMarkerLabel(founder) {
      var deferredMarkerLabel = $q.defer();
      var marker;

      if (_isAnyMarkerColumnSet()) {
        var address = _getAddressFor(founder);

        geocoder.geocode({'address': address}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);

            marker = new google.maps.Marker({
              position: results[0].geometry.location,
              label: { text: founder.companyName },
              title: founder.founder
            });
            marker.id = founder.id;
            deferredMarkerLabel.resolve(marker);
          } else {
            deferredMarkerLabel.reject();
          }
        });
      }
      else {
        if (founder && founder.garageLatitude && founder.garageLongitude) {
          var position = { lat: founder.garageLatitude, lng: founder.garageLongitude };

          marker = new google.maps.Marker({
            position: position,
            label: { text: founder.companyName },
            title: founder.founder
          });
          marker.id = founder.id;
          deferredMarkerLabel.resolve(marker);
        }
      }

      return deferredMarkerLabel.promise;
    }

    function _displayAllMarkers(foundersArray) {
      var bounds = new google.maps.LatLngBounds();
      var markerPromises = [];

      _removeAllMarkersOnMap();

      foundersArray.forEach(function(founder) {
        markerPromises.push(_getMarkerLabel(founder));
      });

      $q.all(markerPromises).then(function(responseDataMarkers) {
        responseDataMarkers.forEach(function(marker) {
          marker.setMap(map);
          bounds.extend(new google.maps.LatLng(marker.getPosition().lat(),marker.getPosition().lng()));
          markersList.push(marker);
        });
        map.fitBounds(bounds);
      });
    }

    function _addColumnAsMarker(column) {
      var indexColumn = markerColumns.indexOf(column);
      if (indexColumn < 0) {
        markerColumns.push(column);
      } else {
        markerColumns.splice(indexColumn, 1);
      }
    }

    return {
      initMap: _initMap,
      showMarker: _showMarker,
      hideMarker: _hideMarker,
      displayAllMarkers: _displayAllMarkers,
      addColumnAsMarker: _addColumnAsMarker
    };
  }]);
