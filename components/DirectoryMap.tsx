'use client';
import {useEffect,useRef} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
type Item={id:string;name:string;type:string;latitude:number|null;longitude:number|null;neighborhood:string;city:string};
export default function DirectoryMap({items,center}:{items:Item[];center:[number,number]}){
 const node=useRef<HTMLDivElement>(null),map=useRef<L.Map|null>(null),layer=useRef<L.LayerGroup|null>(null);
 useEffect(()=>{if(!node.current||map.current)return;map.current=L.map(node.current,{scrollWheelZoom:false}).setView(center,13);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors',maxZoom:19}).addTo(map.current);layer.current=L.layerGroup().addTo(map.current);return()=>{map.current?.remove();map.current=null}},[]);
 useEffect(()=>{if(!map.current||!layer.current)return;layer.current.clearLayers();items.filter(x=>x.latitude!==null&&x.longitude!==null).forEach(x=>{const marker=L.marker([x.latitude!,x.longitude!]).bindPopup(`<strong>${x.name.replace(/[<>]/g,'')}</strong><br>${x.neighborhood}, ${x.city}`);marker.addTo(layer.current!)});},[items]);
 useEffect(()=>{map.current?.setView(center,13)},[center]);
 return <div ref={node} className="map-shell" aria-label="Carte des professionnels à proximité"/>;
}
