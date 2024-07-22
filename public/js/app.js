import { OpenStreetMapProvider } from "leaflet-geosearch";

const lat = -12.0464;
const lng = -77.0428;
const map = L.map('map').setView([lat, lng], 15);
let markers = new L.FeatureGroup().addTo(map);
let marker;

document.addEventListener('DOMContentLoaded', () => {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Buscar la dirección 
    const search = document.querySelector('#formbuscador    ');
    search.addEventListener('input', buscadorDireccion);
})
function buscadorDireccion(e){
    if(e.target.value.length > 8){
        // si existe un pin anterior limpiarlo
        if(marker){
            map.removeLayer(marker);
        }
        //utilizando el Provider y geocoder
        const geocodeService = L.esri.Geocoding.geocodeService();
        const provider =  new OpenStreetMapProvider();
        provider.search({query: e.target.value}).then((resultado)=> {
            
           geocodeService.reverse().latlng(resultado[0].bounds[0],15).run(function(error, result){
            console.log(result);
           
            //mostrar el mapa
             map.setView(resultado[0].bounds[0],15);
            //agregar el pin
             marker = new L.marker(resultado[0].bounds[0],{
                 draggable : true,
                 autoPan : true
             })
             .addTo(map)
             .bindPopup(resultado[0].label)
             .openPopup();
             // detectar movimiento del marker
            marker.on('moveend', function(e){
                marker = e.target;
                const posicion = marker.getLatLng();
                map.panTo(new L.LatLng(posicion.lat, posicion.lng));

                //reverse geocoding cuando el usuario reubica el pin
                geocodeService.reverse().latlng(posicion,15).run(function(error, result){
                    
                    //asigna los valos a bindPopup
                    marker.bindPopup(result.address.LongLabel);
                })
            })
           });

        }) 
    }
}

