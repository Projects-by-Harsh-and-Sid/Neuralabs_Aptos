import { 
    Box, 
    Flex, 
    Heading, 
    Input, 
    IconButton, 
    Text, 
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel, 
    SimpleGrid,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    List,
    ListItem,
    Badge,
    useColorModeValue,
    Center,
    
} from '@chakra-ui/react';

import { 
    FiX, 
    FiActivity, 
    FiEdit2,
    FiLayers,
    FiMaximize2,
    FiAlertCircle,
    FiDatabase, 
    FiSliders, 
    FiExternalLink, 
    FiRepeat, 
    FiGitBranch,
    FiPlayCircle,
    FiXCircle,
    FiMessageCircle,
    FiBookOpen,
    FiServer,
    FiGlobe,
    FiLink,
    FiFileText,
    FiFilter,
    FiGitMerge,
    FiShuffle,
    FiClock,
    FiCpu,
    FiLayout,
    FiCode,
    FiChevronRight,
    FiChevronDown
    
} from 'react-icons/fi';


import {
    MdInfo} from 'react-icons/md';

// Map icon strings to React icons
const ICON_MAP = {
    'database': FiDatabase,
    'activity': FiActivity,
    'sliders': FiSliders,
    'external-link': FiExternalLink,
    'repeat': FiRepeat,
    'git-branch': FiGitBranch,
    'play-circle': FiPlayCircle,
    'x-circle': FiXCircle,
    'message-circle': FiMessageCircle,
    'book-open': FiBookOpen,
    'server': FiServer,
    'globe': FiGlobe,
    'link': FiLink,
    'file-text': FiFileText,
    'filter': FiFilter,
    'git-merge': FiGitMerge,
    'shuffle': FiShuffle,
    'clock': FiClock,
    'cpu': FiCpu,
    'layout': FiLayout,
    'code': FiCode,
    'md-info': MdInfo,
};

export default ICON_MAP;