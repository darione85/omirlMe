package it.fadeout.omirl;

import java.util.ArrayList;
import java.util.List;

import it.fadeout.omirl.business.OmirlUser;
import it.fadeout.omirl.business.config.HydroLinkConfig;
import it.fadeout.omirl.business.config.MapLinkConfig;
import it.fadeout.omirl.business.config.MapThirdLevelLinkConfig;
import it.fadeout.omirl.business.config.OmirlNavigationConfig;
import it.fadeout.omirl.business.config.RadarLinkConfig;
import it.fadeout.omirl.business.config.SatelliteLinkConfig;
import it.fadeout.omirl.business.config.SensorLinkConfig;
import it.fadeout.omirl.business.config.StaticLinkConfig;
import it.fadeout.omirl.viewmodels.HydroLink;
import it.fadeout.omirl.viewmodels.MapLink;
import it.fadeout.omirl.viewmodels.MapThirdLevelLink;
import it.fadeout.omirl.viewmodels.PrimitiveResult;
import it.fadeout.omirl.viewmodels.RadarLink;
import it.fadeout.omirl.viewmodels.SatelliteLink;
import it.fadeout.omirl.viewmodels.SensorLink;
import it.fadeout.omirl.viewmodels.StaticLink;

import javax.servlet.ServletConfig;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;

@Path("/mapnavigator")
public class MapNavigatorService {
	
	@Context
	ServletConfig m_oServletConfig;
	
	public MapNavigatorService() {
	}
	
	/**
	 * Test Method
	 * @return
	 */
	@GET
	@Path("/test")
	@Produces({"application/xml", "application/json", "text/xml"})
	public PrimitiveResult TestOmirl() {
		// Just a keep alive message
		PrimitiveResult oTest = new PrimitiveResult();
		oTest.StringValue = "Omirl is Working";
		return oTest;
	}
	
	/**
	 * Reloads xml file configuration
	 * @return
	 */
	@GET
	@Path("/reload")
	@Produces({"application/xml", "application/json", "text/xml"})
	public PrimitiveResult ReloadConfig() {
		PrimitiveResult oTest = new PrimitiveResult();
		oTest.StringValue = "Omirl Configuration Updated";
		
		Object oConfig = null;
		
		try {
			String sConfigFilePath = m_oServletConfig.getInitParameter("ConfigFilePath");
			
			oConfig = Omirl.deserializeXMLToObject(sConfigFilePath);
			
			OmirlNavigationConfig oConfiguration = (OmirlNavigationConfig) oConfig;
			
			if (oConfiguration.getHydroLinks()!=null)
			{
				if (oConfiguration.getFlattedHydroLinks()==null)
				{
					oConfiguration.setFlattedHydroLinks(new ArrayList<HydroLinkConfig>());
				}

				for (HydroLinkConfig oHLinkConfig : oConfiguration.getHydroLinks()) {
					oConfiguration.getFlattedHydroLinks().add(oHLinkConfig);

					if (oHLinkConfig.getChildren()!=null)
					{
						for (HydroLinkConfig oChild1 : oHLinkConfig.getChildren()) {
							oConfiguration.getFlattedHydroLinks().add(oChild1);

							if (oChild1.getChildren()!=null)
							{
								for (HydroLinkConfig oChild2 : oChild1.getChildren()) {
									oConfiguration.getFlattedHydroLinks().add(oChild2);
								}	
							}								
						}	
					}
				}
			}
			
			m_oServletConfig.getServletContext().setAttribute("Config", oConfiguration);
			
		} catch (Exception e) {
			oTest.StringValue = "Error reloading Configuration";
			//m_oServletConfig.getServletContext().setAttribute("Config", new OmirlNavigationConfig());
			e.printStackTrace();
		}
		
		return oTest;
	}
	
	
	/**
	 * Gets the first level of sensors
	 * @return
	 */
	@GET
	@Path("/sensors")
	@Produces({"application/xml", "application/json", "text/xml"})
	public List<SensorLink> getSensorLinks(@HeaderParam("x-session-token") String sSessionId) {
		
		ArrayList<SensorLink> aoSensorLinks = new ArrayList<>();

		Object oConfObj = m_oServletConfig.getServletContext().getAttribute("Config");
		
		if (oConfObj != null)  {
			
			// Call get user from session to update last touch if user is logged. Don't care about return here that is free access
			OmirlUser oUser = Omirl.getUserFromSession(sSessionId);
			
			int iUserAccessLevel = 9999;
			if (oUser!=null) iUserAccessLevel = oUser.getRole();

			OmirlNavigationConfig oConfig = (OmirlNavigationConfig) oConfObj;
			
			for (SensorLinkConfig oLinkConfig : oConfig.getSensorLinks()) {
				
				if (oLinkConfig.getAccessLevel() == 0 || oLinkConfig.getAccessLevel()>= iUserAccessLevel) 
					aoSensorLinks.add(oLinkConfig.getSensorLink());
			}
		}
		
		
		return aoSensorLinks;
	}
	
	/**
	 * Gets the first level of static layers
	 * @return
	 */
	@GET
	@Path("/statics")
	@Produces({"application/xml", "application/json", "text/xml"})
	public List<StaticLink> getStaticLinks(@HeaderParam("x-session-token") String sSessionId) {
		
		ArrayList<StaticLink> aoStaticLinks = new ArrayList<>();

		Object oConfObj = m_oServletConfig.getServletContext().getAttribute("Config");
		
		if (oConfObj != null)  {
			OmirlNavigationConfig oConfig = (OmirlNavigationConfig) oConfObj;
			
			// Call get user from session to update last touch if user is logged. Don't care about return here that is free access
			OmirlUser oUser = Omirl.getUserFromSession(sSessionId);
			
			int iUserAccessLevel = 9999;
			if (oUser!=null) iUserAccessLevel = oUser.getRole();
			
			
			for (StaticLinkConfig oLinkConfig : oConfig.getStaticLinks()) {
				if (oLinkConfig.getAccessLevel() == 0 || oLinkConfig.getAccessLevel()>= iUserAccessLevel) 
					aoStaticLinks.add(oLinkConfig.getStaticLink());
			}
		}
		
		return aoStaticLinks;
	}	
	
	/**
	 * Gets the first level of dynamic layers
	 * @return
	 */
	@GET
	@Path("/maps")
	@Produces({"application/xml", "application/json", "text/xml"})
	public List<MapLink> getMapsFirstLevelLinks(@HeaderParam("x-session-token") String sSessionId) {
		
		ArrayList<MapLink> aoMapLinks = new ArrayList<>();

		Object oConfObj = m_oServletConfig.getServletContext().getAttribute("Config");
		
		if (oConfObj != null)  {
			OmirlNavigationConfig oConfig = (OmirlNavigationConfig) oConfObj;
			
			// Call get user from session to update last touch if user is logged. Don't care about return here that is free access
			OmirlUser oUser = Omirl.getUserFromSession(sSessionId);
			
			int iUserAccessLevel = 9999;
			if (oUser!=null) iUserAccessLevel = oUser.getRole();
			
			for (MapLinkConfig oLinkConfig : oConfig.getMapLinks()) {
				if (oLinkConfig.getAccessLevel() == 0 || oLinkConfig.getAccessLevel()>= iUserAccessLevel) 
					aoMapLinks.add(oLinkConfig.getMapLink());
			}
		}
		
		return aoMapLinks;
	}
	
	@GET
	@Path("/maps/{idlink}")
	@Produces({"application/xml", "application/json", "text/xml"})
	public List<MapLink> getMapsSecondLevelLinks(@PathParam("idlink") int iIdLink, @HeaderParam("x-session-token") String sSessionId) {
		ArrayList<MapLink> aoMapLinks = new ArrayList<>();

		Object oConfObj = m_oServletConfig.getServletContext().getAttribute("Config");
		
		if (oConfObj != null)  {
			OmirlNavigationConfig oConfig = (OmirlNavigationConfig) oConfObj;
			
			// Call get user from session to update last touch if user is logged. Don't care about return here that is free access
			OmirlUser oUser = Omirl.getUserFromSession(sSessionId);
			
			int iUserAccessLevel = 9999;
			if (oUser!=null) iUserAccessLevel = oUser.getRole();
			
			for (MapLinkConfig oLinkConfig : oConfig.getMapLinks()) {
				
				if (oLinkConfig.getLinkId() == iIdLink) {
					for (MapLinkConfig oSecondLevelLink : oLinkConfig.getSecondLevels()) {
						if (oSecondLevelLink.getAccessLevel() == 0 || oSecondLevelLink.getAccessLevel()>= iUserAccessLevel) 
							aoMapLinks.add(oSecondLevelLink.getMapLink());
					}
					break;
					
				}
			}
		}
		
		return aoMapLinks;
	}
	
	@GET
	@Path("/mapsthird/{idlink}")
	@Produces({"application/xml", "application/json", "text/xml"})
	public List<MapThirdLevelLink> getMapsThirdLevelLinks(@PathParam("idlink") int iIdLink, @HeaderParam("x-session-token") String sSessionId) {
		ArrayList<MapThirdLevelLink> aoMapThirdLevelLinks = new ArrayList<>();

		Object oConfObj = m_oServletConfig.getServletContext().getAttribute("Config");
		
		if (oConfObj != null)  {
			OmirlNavigationConfig oConfig = (OmirlNavigationConfig) oConfObj;
			
			// Call get user from session to update last touch if user is logged. Don't care about return here that is free access
			OmirlUser oUser = Omirl.getUserFromSession(sSessionId);
			
			int iUserAccessLevel = 9999;
			if (oUser!=null) iUserAccessLevel = oUser.getRole();
			
			for (MapLinkConfig oLinkConfig : oConfig.getMapLinks()) {
				
				
				for (MapLinkConfig oSecondLevelLink : oLinkConfig.getSecondLevels()) {
					
					if (oSecondLevelLink.getLinkId() == iIdLink) {
						if (oSecondLevelLink.isHasThirdLevel()) {
							for (MapThirdLevelLinkConfig oThird : oSecondLevelLink.getThirdLevels()) {
								if (oThird.getAccessLevel() == 0 || oThird.getAccessLevel()>= iUserAccessLevel) 
									aoMapThirdLevelLinks.add(oThird.getMapThirdLevelLink());
							}
						}
						
						break;
					}
					
					
				}
			}
		}
		
		return aoMapThirdLevelLinks;
	}
	
	
	
	
	/**
	 * Gets the first level of dynamic layers
	 * @return
	 */
	@GET
	@Path("/hydro")
	@Produces({"application/xml", "application/json", "text/xml"})
	public List<HydroLink> getHydroFirstLevelLinks(@HeaderParam("x-session-token") String sSessionId) {
		
		ArrayList<HydroLink> aoHydroLinks = new ArrayList<>();
		
		OmirlUser oUser = Omirl.getUserFromSession(sSessionId);

		if (oUser != null) {
			Object oConfObj = m_oServletConfig.getServletContext().getAttribute("Config");
			
			int iUserAccessLevel = oUser.getRole();
			
			if (oConfObj != null)  {
				OmirlNavigationConfig oConfig = (OmirlNavigationConfig) oConfObj;
				
				for (HydroLinkConfig oLinkConfig : oConfig.getHydroLinks()) {
					if (oLinkConfig.getAccessLevel() == 0 || oLinkConfig.getAccessLevel()>= iUserAccessLevel) 
						aoHydroLinks.add(oLinkConfig.getHydroLink());
				}
			}			
		}
		
		return aoHydroLinks;
	}
	
	@GET
	@Path("/hydro/{linkcode}")
	@Produces({"application/xml", "application/json", "text/xml"})
	public List<HydroLink> getHydroSecondLevelLinks(@PathParam("linkcode") String sLinkCode, @HeaderParam("x-session-token") String sSessionId) {
		ArrayList<HydroLink> aoHydroLinks = new ArrayList<>();

		OmirlUser oUser = Omirl.getUserFromSession(sSessionId);
		if (oUser != null) {
			Object oConfObj = m_oServletConfig.getServletContext().getAttribute("Config");
			
			if (oConfObj != null)  {
				OmirlNavigationConfig oConfig = (OmirlNavigationConfig) oConfObj;
				
				int iUserAccessLevel = oUser.getRole();
				
				for (HydroLinkConfig oLinkConfig : oConfig.getHydroLinks()) {
					
					if (oLinkConfig.getLinkCode().equals(sLinkCode)) {
						for (HydroLinkConfig oSecondLevelLink : oLinkConfig.getChildren()) {
							HydroLink oHydroSecondLink = oSecondLevelLink.getHydroLink();
							oHydroSecondLink.setParentLinkCode(sLinkCode);
							oHydroSecondLink.setParentDescription(oLinkConfig.getDescription());
							
							if (oSecondLevelLink.getAccessLevel() == 0 || oSecondLevelLink.getAccessLevel()>= iUserAccessLevel)
								aoHydroLinks.add(oHydroSecondLink);
						}
						break;
						
					}
				}
			}
		}
		
		return aoHydroLinks;
	}
	
	@GET
	@Path("/hydrothird/{linkCode}")
	@Produces({"application/xml", "application/json", "text/xml"})
	public List<HydroLink> getHydroThirdLevelLinks(@PathParam("linkCode") String sLinkCode, @HeaderParam("x-session-token") String sSessionId) {
		ArrayList<HydroLink> aoHydroThirdLevelLinks = new ArrayList<>();
		
		OmirlUser oUser = Omirl.getUserFromSession(sSessionId);
		
		if (oUser != null) {
			Object oConfObj = m_oServletConfig.getServletContext().getAttribute("Config");
			
			int iUserAccessLevel = oUser.getRole();
			
			if (oConfObj != null)  {
				OmirlNavigationConfig oConfig = (OmirlNavigationConfig) oConfObj;
				
				for (HydroLinkConfig oLinkConfig : oConfig.getHydroLinks()) {
					
					
					for (HydroLinkConfig oSecondLevelLink : oLinkConfig.getChildren()) {
						
						if (oSecondLevelLink.getLinkCode().equals(sLinkCode)) {
							if (oSecondLevelLink.isHasThirdLevel()) {
								for (HydroLinkConfig oThird : oSecondLevelLink.getChildren()) {
									HydroLink oThirdLink = oThird.getHydroLink();
									oThirdLink.setParentLinkCode(oLinkConfig.getLinkCode());
									oThirdLink.setParentDescription(oSecondLevelLink.getDescription());
									if (oThird.getAccessLevel() == 0 || oThird.getAccessLevel()>= iUserAccessLevel)
										aoHydroThirdLevelLinks.add(oThirdLink);
								}
							}
							
							break;
						}
						
						
					}
				}
			}
		}
		
		return aoHydroThirdLevelLinks;
	}	
	
	
	@GET
	@Path("/flattedhydro")
	@Produces({"application/xml", "application/json", "text/xml"})
	public List<HydroLink> getFlattedHydroLinks(@HeaderParam("x-session-token") String sSessionId) {
		ArrayList<HydroLink> aoHydroLinks = new ArrayList<>();

		OmirlUser oUser = Omirl.getUserFromSession(sSessionId);
		
		if (oUser != null) {
			Object oConfObj = m_oServletConfig.getServletContext().getAttribute("Config");
			
			if (oConfObj != null)  {
				OmirlNavigationConfig oConfig = (OmirlNavigationConfig) oConfObj;
				
				int iUserAccessLevel = oUser.getRole();
				
				for (HydroLinkConfig oLinkConfig : oConfig.getHydroLinks()) {
					
					if (oLinkConfig.getAccessLevel() == 0 || oLinkConfig.getAccessLevel()>= iUserAccessLevel)
						aoHydroLinks.add(oLinkConfig.getHydroLink());
					
					//System.out.println("Livello 1 " + oLinkConfig.getLinkCode());
										
					for (HydroLinkConfig oSecondLevelLink : oLinkConfig.getChildren()) {
						HydroLink oHydroSecondLink = oSecondLevelLink.getHydroLink();
						oHydroSecondLink.setParentLinkCode(oLinkConfig.getLinkCode());
						oHydroSecondLink.setParentDescription(oLinkConfig.getDescription());
						
						if (oSecondLevelLink.getAccessLevel() == 0 || oSecondLevelLink.getAccessLevel()>= iUserAccessLevel)
							aoHydroLinks.add(oHydroSecondLink);
						
						//System.out.println("Livello 2 " + oHydroSecondLink.getLinkCode());
					}
				}
			}
		}
		
		return aoHydroLinks;
	}	
	
	
	/**
	 * Gets the first level of dynamic layers
	 * @return
	 */
	@GET
	@Path("/radar")
	@Produces({"application/xml", "application/json", "text/xml"})
	public List<RadarLink> getRadarFirstLevelLinks(@HeaderParam("x-session-token") String sSessionId) {
		
		ArrayList<RadarLink> aoRadarLinks = new ArrayList<>();
		
		OmirlUser oUser = Omirl.getUserFromSession(sSessionId);

		if (oUser!= null) {
			Object oConfObj = m_oServletConfig.getServletContext().getAttribute("Config");
			
			int iUserAccessLevel = oUser.getRole();
			
			if (oConfObj != null)  {
				OmirlNavigationConfig oConfig = (OmirlNavigationConfig) oConfObj;
				
				for (RadarLinkConfig oLinkConfig : oConfig.getRadarLinks()) {
					if (oLinkConfig.getAccessLevel() == 0 || oLinkConfig.getAccessLevel()>= iUserAccessLevel)
						aoRadarLinks.add(oLinkConfig.getRadarLink());
				}
			}			
		}
		
		return aoRadarLinks;
	}
	
	@GET
	@Path("/radar/{linkcode}")
	@Produces({"application/xml", "application/json", "text/xml"})
	public List<RadarLink> getRadarSecondLevelLinks(@PathParam("linkcode") String sLinkCode, @HeaderParam("x-session-token") String sSessionId) {
		ArrayList<RadarLink> aoRadarLinks = new ArrayList<>();

		OmirlUser oUser = Omirl.getUserFromSession(sSessionId);
		
		if (oUser!= null) {
			Object oConfObj = m_oServletConfig.getServletContext().getAttribute("Config");
			
			int iUserAccessLevel = oUser.getRole();
			
			if (oConfObj != null)  {
				OmirlNavigationConfig oConfig = (OmirlNavigationConfig) oConfObj;
				
				for (RadarLinkConfig oLinkConfig : oConfig.getRadarLinks()) {
					
					if (oLinkConfig.getLinkCode().equals(sLinkCode)) {
						for (RadarLinkConfig oSecondLevelLink : oLinkConfig.getChildren()) {
							RadarLink oHydroSecondLink = oSecondLevelLink.getRadarLink();
							oHydroSecondLink.setParentLinkCode(sLinkCode);
							oHydroSecondLink.setParentDescription(oLinkConfig.getDescription());
							if (oSecondLevelLink.getAccessLevel() == 0 || oSecondLevelLink.getAccessLevel()>= iUserAccessLevel)
								aoRadarLinks.add(oHydroSecondLink);
						}
						break;
						
					}
				}
			}
		}
		
		return aoRadarLinks;
	}
	
	@GET
	@Path("/radarthird/{linkCode}")
	@Produces({"application/xml", "application/json", "text/xml"})
	public List<RadarLink> getRadarThirdLevelLinks(@PathParam("linkCode") String sLinkCode, @HeaderParam("x-session-token") String sSessionId) {
		ArrayList<RadarLink> aoRadarThirdLevelLinks = new ArrayList<>();
		
		OmirlUser oUser = Omirl.getUserFromSession(sSessionId);
		
		if (oUser!= null) {
			Object oConfObj = m_oServletConfig.getServletContext().getAttribute("Config");
			
			int iUserAccessLevel = oUser.getRole();
			
			if (oConfObj != null)  {
				OmirlNavigationConfig oConfig = (OmirlNavigationConfig) oConfObj;
				
				for (RadarLinkConfig oLinkConfig : oConfig.getRadarLinks()) {
					
					
					for (RadarLinkConfig oSecondLevelLink : oLinkConfig.getChildren()) {
						
						if (oSecondLevelLink.getLinkCode().equals(sLinkCode)) {
							if (oSecondLevelLink.isHasThirdLevel()) {
								for (RadarLinkConfig oThird : oSecondLevelLink.getChildren()) {
									RadarLink oThirdLink = oThird.getRadarLink();
									oThirdLink.setParentLinkCode(oLinkConfig.getLinkCode());
									oThirdLink.setParentDescription(oSecondLevelLink.getDescription());
									if (oThird.getAccessLevel() == 0 || oThird.getAccessLevel()>= iUserAccessLevel)
										aoRadarThirdLevelLinks.add(oThirdLink);
								}
							}
							
							break;
						}
						
						
					}
				}
			}
		}
		
		return aoRadarThirdLevelLinks;
	}	
	
	
	/**
	 * Gets the first level of dynamic layers
	 * @return
	 */
	@GET
	@Path("/satellite")
	@Produces({"application/xml", "application/json", "text/xml"})
	public List<SatelliteLink> getSatelliteFirstLevelLinks(@HeaderParam("x-session-token") String sSessionId) {
		
		ArrayList<SatelliteLink> aoSatelliteLinks = new ArrayList<>();
		
		OmirlUser oUser = Omirl.getUserFromSession(sSessionId);

		if (oUser!= null) {
			Object oConfObj = m_oServletConfig.getServletContext().getAttribute("Config");
			
			int iUserAccessLevel = oUser.getRole();
			
			if (oConfObj != null)  {
				OmirlNavigationConfig oConfig = (OmirlNavigationConfig) oConfObj;
				
				for (SatelliteLinkConfig oLinkConfig : oConfig.getSatelliteLinks()) {
					if (oLinkConfig.getAccessLevel() == 0 || oLinkConfig.getAccessLevel()>= iUserAccessLevel)
						aoSatelliteLinks.add(oLinkConfig.getSatelliteLink());
				}
			}			
		}
		
		return aoSatelliteLinks;
	}
	
	@GET
	@Path("/satellite/{linkcode}")
	@Produces({"application/xml", "application/json", "text/xml"})
	public List<SatelliteLink> getSatelliteSecondLevelLinks(@PathParam("linkcode") String sLinkCode, @HeaderParam("x-session-token") String sSessionId) {
		ArrayList<SatelliteLink> aoSatelliteLinks = new ArrayList<>();

		OmirlUser oUser = Omirl.getUserFromSession(sSessionId);
		
		if (oUser!= null) {
			Object oConfObj = m_oServletConfig.getServletContext().getAttribute("Config");
			
			int iUserAccessLevel = oUser.getRole();
			
			if (oConfObj != null)  {
				OmirlNavigationConfig oConfig = (OmirlNavigationConfig) oConfObj;
				
				for (SatelliteLinkConfig oLinkConfig : oConfig.getSatelliteLinks()) {
					
					if (oLinkConfig.getLinkCode().equals(sLinkCode)) {
						for (SatelliteLinkConfig oSecondLevelLink : oLinkConfig.getChildren()) {
							SatelliteLink oSatelliteSecondLink = oSecondLevelLink.getSatelliteLink();
							oSatelliteSecondLink.setParentLinkCode(sLinkCode);
							oSatelliteSecondLink.setParentDescription(oLinkConfig.getDescription());
							if (oSecondLevelLink.getAccessLevel() == 0 || oSecondLevelLink.getAccessLevel()>= iUserAccessLevel)
								aoSatelliteLinks.add(oSatelliteSecondLink);
						}
						break;
						
					}
				}
			}
		}
		
		return aoSatelliteLinks;
	}
	
	@GET
	@Path("/satellitethird/{linkCode}")
	@Produces({"application/xml", "application/json", "text/xml"})
	public List<SatelliteLink> getSatelliteThirdLevelLinks(@PathParam("linkCode") String sLinkCode, @HeaderParam("x-session-token") String sSessionId) {
		ArrayList<SatelliteLink> aoSatelliteThirdLevelLinks = new ArrayList<>();
		
		OmirlUser oUser = Omirl.getUserFromSession(sSessionId);
		
		if (oUser!= null) {
			Object oConfObj = m_oServletConfig.getServletContext().getAttribute("Config");
			
			int iUserAccessLevel = oUser.getRole();
			
			if (oConfObj != null)  {
				OmirlNavigationConfig oConfig = (OmirlNavigationConfig) oConfObj;
				
				for (SatelliteLinkConfig oLinkConfig : oConfig.getSatelliteLinks()) {
					
					
					for (SatelliteLinkConfig oSecondLevelLink : oLinkConfig.getChildren()) {
						
						if (oSecondLevelLink.getLinkCode().equals(sLinkCode)) {
							if (oSecondLevelLink.isHasThirdLevel()) {
								for (SatelliteLinkConfig oThird : oSecondLevelLink.getChildren()) {
									SatelliteLink oThirdLink = oThird.getSatelliteLink();
									oThirdLink.setParentLinkCode(oLinkConfig.getLinkCode());
									oThirdLink.setParentDescription(oSecondLevelLink.getDescription());
									if (oThird.getAccessLevel() == 0 || oThird.getAccessLevel()>= iUserAccessLevel)
										aoSatelliteThirdLevelLinks.add(oThirdLink);
								}
							}
							
							break;
						}
						
						
					}
				}
			}
		}
		
		return aoSatelliteThirdLevelLinks;
	}	
}
