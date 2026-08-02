export interface Alert {
  id: string;
  popup_type?: 'Popup' | 'Fullscreen' | 'Banner';
  severity?: 'Critical' | 'High' | 'Medium' | 'Low';
  target_location?: string;
  title?: string;
  message?: string;
  [key: string]: any;
}
