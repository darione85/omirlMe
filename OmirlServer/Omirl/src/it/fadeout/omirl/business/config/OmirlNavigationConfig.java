package it.fadeout.omirl.business.config;

import java.util.ArrayList;

public class OmirlNavigationConfig {
	
	ArrayList<MapLinkConfig> mapLinks = new ArrayList<MapLinkConfig>();
	ArrayList<SensorLinkConfig> sensorLinks = new ArrayList<SensorLinkConfig>();
	ArrayList<StaticLinkConfig> staticLinks = new ArrayList<StaticLinkConfig>();
	
	public ArrayList<MapLinkConfig> getMapLinks() {
		return mapLinks;
	}
	public void setMapLinks(ArrayList<MapLinkConfig> mapLinks) {
		this.mapLinks = mapLinks;
	}
	public ArrayList<SensorLinkConfig> getSensorLinks() {
		return sensorLinks;
	}
	public void setSensorLinks(ArrayList<SensorLinkConfig> sensorLinks) {
		this.sensorLinks = sensorLinks;
	}
	public ArrayList<StaticLinkConfig> getStaticLinks() {
		return staticLinks;
	}
	public void setStaticLinks(ArrayList<StaticLinkConfig> staticLinks) {
		this.staticLinks = staticLinks;
	}	
}