export const vendorPiwik = (code, From) => {
  switch (code) {

    case 'SBT':
      PiwikEvent('BTi_sportpage')
      break;
    case 'IPSB':
      PiwikEvent('IMSB_sportpage')
      break;
    case 'OWS':
      PiwikEvent('OW_sportpage')
      break;
    case 'AIS':
      From == 'Home' ? PiwikEvent('Game', 'Launch', 'Ai_sport_homepage') : PiwikEvent('Game', 'Launch', 'Ai_sportpage')
      break;
    case 'EVO':
      From == 'Home' ? PiwikEvent('Game', 'Launch', 'EVO_HomePage') : PiwikEvent('Game', 'Launch', 'EVO_LivePage')
      break;
    case 'BGG':
      PiwikEvent('BG_livepage')
      break;
    case 'GPI':
      PiwikEvent('GP_livepage')
      break;
    case 'AGL':
      PiwikEvent('AG_livepage')
      break;
    case 'NLE':
      PiwikEvent('N2L_livepage')
      break;
    case 'SAL':
      PiwikEvent('SAG_livepage')
      break;
    case 'ABT':
      PiwikEvent('ALLBET_livepage')
      break;
    case 'GDL':
      PiwikEvent('GD_livepage')
      break;
    case 'KYG':
      PiwikEvent('KYG_P2Ppage')
      break;
    case 'IPES':
      PiwikEvent('IMES_esportpage')
      break;
    case 'TFG':
      PiwikEvent('TF_esportpage')
      break;
    case 'MGSQF':
      PiwikEvent('MGSQF_slotpage')
      break;
    case 'PT':
      PiwikEvent('PT_slotpage')
      break;
    case 'BSG':
      PiwikEvent('BSG_slotpage')
      break;
    case 'TG':
      PiwikEvent('PP_slotpage')
      break;
    case 'SPG':
      PiwikEvent('SPG_slotpage')
      break;
    case 'DTG':
      PiwikEvent('DTG_slotpage')
      break;
    case 'CW':
      PiwikEvent('CW_slotpage')
      break;
    case 'AG':
      PiwikEvent('Fishing2_slotpage')
      break;
    case 'BOY':
      PiwikEvent('BY_kenopage')
      break;
    case 'VRL':
      PiwikEvent('VR_kenopage')
      break;
    case 'TCG':
      From == 'Home' ? PiwikEvent('Game', 'Launch', 'TC_HomePage') : PiwikEvent('Game', 'Launch', 'TC_KenoPage')
      break;
    default:
      break;
  }
}