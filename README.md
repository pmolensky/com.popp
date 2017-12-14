# PoPP Z-Wave Device support App for Homey @ Athom.com    
   
Donations will be used for charity. Every 25 euros collected will be send to a different charity organization every time. I make this app for fun and don’t tend to make profit for my own.
If you like the work. Please think of the people who you could please a bit by donating.
Want the next donation to go to your favorite charity ? Don’t hesitate and tell me what it is.
    
## Supported devices    
* 004001 - Smoke Detector and Siren  
* 004001 - CO2 Sensor  
* 005107 - Solar Outside Siren  
* 005206 - Z-Weather  
* 700168 - Z-Rain
* 009006 - Wall Plug Switch Indoor    
* 009105 - Wall Plug Switch Outdoor 
* 009204 - KFOB-C Remote Control     
* 009402 - 10 Year Smoke Detector and Siren 
* 009501 - Secure Flow Stop – Valve Shut-Off   
* 010101 - Thermostat Valve 
* 012501 - Strike Lock Control   
* 123580 - Dimmer 67G   
* 123610 - Switch 68G    
    
## Untested devices    
* 005206 - Weather - Need help some reports dont get in  
* 004001 - CO2 Sensor - Please confirm if its working when you have it    
* 009204 - KFOB-C Remote Control - Please confirm if its working when you have it 
   
## Unsupported devices ?    
You are welcome to help , please send in you're git pull requests to add more devices to the list.    
    
## Supported Languages:    
* English    
* Dutch    
    
## Support notes:    
Most reliable way to update battery powered devices   
1. Place the sensor near Homey (< 1 meter)   
2. Change the settings to the values you want   
3. Wake up the sensor    
4. During the blinking of the LED (indicating connection to Homey) press "save settings"   

If problems persists:    
a. Temporarely disable other Z-wave apps   
b. change the setting to another value with above steps   
c. check if effective and retry to the desired value    

## Change Log:    

### v 2.0.1
**updated:**    
Added support for the keypad and co2 sensor, please test    
    
### v 2.0.0
**updated:**    
Rewrite to the new SDKv2 and Z-Wave Mesh Driver   
  
### v 1.1.7
**added:**    
* 700168 - Z.Rain
  
### v 1.1.6     
**fixed:**    
Corrected ProductID on Keyfob and Valve because of wrong info in PoPP documentation  
Fixed typo in the double click button 3 flow card      
  
### v 1.1.5   
**fixed:**    
Typo in the valve driver that crashed the PoPP app :(  
  
### v 1.1.4   
added:   
009006 - Wall Plug Switch Indoor
009105 - Wall Plug Switch Outdoor
009204 - KFOB-C Remote Control
009501 - Secure Flow Stop – Valve Shut-Off  
    
### v 1.1.3   
**added:**    
009402 - 10 Year Smoke Detector and Siren    
**update:**   
Added new manufacturerId for Z-Weather, seems like PoPP doesnt even take the trouble to flash there own firmware in the rebranded stuff anymore   
  
### v 1.1.2   
**added:**    
012501 - PoPP Strike Lock Control    
  
### v 1.1.1   
**added:**    
004001 - PoPP Smoke Detector and Siren  
005206 - PoPP Weather  
    
These devices are added just by reading the documentation.    
PoPP.Eu is known for its limited documantation , so please report to me if you    
have one of these devices for testing.  
    
**update:**    
Z-Wave driver updated to 1.1.6    
  
    
### v 1.1.0 - Warning - re-pair could be needed    
**update:**    
Complete re-write of the Solar Siren only app to support more devices. Driver names changed so it matches the device id.    
    
**added:**    
Siren tamper and battery alarm.    
Siren trigger on temperature and battery alarm.    
Thermostat Valve added wakeup report for temp.    
Dimmer 67G support.    
Switch 68G support.    
    
**known issues:**    
Thermo Valve E5 errors and lost of connection / high battery usage.    
Athom is working on a solution it the core for this problem.    




