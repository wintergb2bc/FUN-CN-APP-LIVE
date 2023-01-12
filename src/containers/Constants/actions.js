// banner事件列表
export const actionMaps = [
    { id: 0, name: "No Action" },
    { id: 1, name: "Redirect" },
    { id: 2, name: "New Tab" },
    { id: 3, name: "deposit" },
    { id: 4, name: "transfer" },
    { id: 5, name: "Registration" },
    { id: 100, name: "Promotion" },
    {
      id: 101,
      name: "Bonus Promotion",
      promotionMasterCategory: "bonuspromotion"
    },
    {
      id: 102,
      name: "Rebate Promotion",
      promotionMasterCategory: "rebatepromotion"
    },
    {
      id: 103,
      name: "Manual Promotion",
      promotionMasterCategory: "manualpromotion"
    },
    {
      id: 104,
      name: "Other Promotion",
      promotionMasterCategory: "manualpromotion"
    },
    { id: 200, name: "BTi sportbook", ameCode: "SBT" },
    { id: 201, name: "IM sportbook", gameCode: "IPSB" },
    { id: 202, name: "IM Esport", gameId: 0, gameCode: "IPES" },
    { id: 300, name: "Live Casino" },
    { id: 301, name: "RB Live Dealer", gameId: 0, gameCode: "GPI" },
    { id: 302, name: "AG Live Dealer", gameId: 76, gameCode: "AGL" },
    { id: 303, name: "MG Live Dealer", gameId: MGSQFCASINO, gameCode: "MGSQF" },
    { id: 304, name: "GD Live Dealer", gameId: 1050, gameCode: "GDL" },
    { id: 305, name: "SA Live Dealer", gameId: 1712, gameCode: "SAL" },
    { id: 306, name: "N2 Live Dealer", gameId: 1517, gameCode: "NLE" },
    { id: 307, name: "AB Live Dealer", gameId: 114, gameCode: "ABT" },
    { id: 400, name: "P2P", gameId: 0, gameCode: "JBP" },
    { id: 500, name: "Slot" },
    { id: 501, name: "YD SLOT", gameCode: "YD" },
    { id: 502, name: "MG SLOT", gameCode: "MG" },
    { id: 503, name: "SG SLOT", gameCode: "SG" },
    { id: 504, name: "PG SLOT", gameCode: "PG" },
    { id: 505, name: "PT SLOT", gameCode: "PT" },
    { id: 506, name: "BS SLOT", gameCode: "BS" },
    { id: 507, name: "GN SLOT", gameCode: "GN" },
    { id: 508, name: "TG SLOT", gameCode: "TG" },
    { id: 600, name: "Keno", gameId: 0, gameCode: "SGW" },
    { id: 700, name: "Fishing", gameCode: "AG" }
  ];
  
  // 友盟事件列表
  export const AnalyMaps = {
    YD: "YD_slot_sidemenu",
    PT: "PT_slot_sidemenu",
    MG: "MG_slot_sidemenu",
    SG: "SG_slot_sidemenu",
    PG: "PG_slot_sidemenu",
    BS: "BS_slot_sidemenu",
    GN: "GN_slot_sidemenu",
    TG: "TG_slot_sidemenu",
    IPES: "IMESports_sidemenu",
    JBP: "P2P_sidemenu",
    GPI: "RBCasino_live_sidemenu",
    AGL: "AG_live_sidemenu",
    MGSQF: "MG_live_sidemenu",
    GDL: "GD_live_sidemenu",
    SAL: "SA_live_sidemenu",
    ABT: "AB_live_sidemenu",
    GEN: "GN_fishing_sidemenu",
    AG: "AG_fishing_sidemenu"
  };