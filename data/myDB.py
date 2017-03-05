from collections import OrderedDict
import xmltodict, json
import sqlite3
import os


conn = sqlite3.connect("myDB.db")
cursor = conn.cursor()

#Relational tables
cursor.execute("CREATE TABLE Star (starID INTEGER PRIMARY KEY, name STRING, radius FLOAT, temp FLOAT)")
cursor.execute("CREATE TABLE Planet (planetID INTEGER PRIMARY KEY, systemId INT, name STRING, period FLOAT, radius FLOAT, temp FLOAT)")
cursor.execute("CREATE TABLE Systems (systemID INTEGER PRIMARY KEY, name STRING, decLat FLOAT, ascLong FLOAT, dist FLOAT)")

cursor.execute("""CREATE TABLE SystemStar (systemStarID INTEGER PRIMARY KEY,
starID INT,
systemID INT,
FOREIGN KEY(systemID) REFERENCES Systems(systemsID),
FOREIGN KEY(starID) REFERENCES Star(starID))""")

cursor.execute("""CREATE TABLE StarPlanet (starPlanetID INTEGER PRIMARY KEY,
starID INT,
planetID INT,
FOREIGN KEY(planetID) REFERENCES Planet(planetID),
FOREIGN KEY(starID) REFERENCES Star(starID))""")

path = "/mnt/data/code/github/CUHacking/data/systems_kepler"

s = 0
st = 0
p = 0

def parseDMSDec(dmsString):
    sign=False
    if(dmsString[0]=="+"):
        sign=True

    strWithoutSign=dmsString[1:len(dmsString)]
    strList = strWithoutSign.split()
    d=int(strList[0])
    m=int(strList[1])
    s=float(strList[2])
    return sign,d,m,s


def parseHMSAsc(dmsString):
    strList = dmsString.split()
    d = int(strList[0])
    m = int(strList[1])
    s = float(strList[2])
    return d, m, s

# this takes in alt and long in dd mm ss format and converts it to decimal degrees
# the boolean is false for representing negative and the opposite is true
def convertHMSToDD(h,m,s):
    dd= (float(h)*15)+(float(m)/4)+(float(s)/240)
    return dd

def convertDMSToDD(bool, d, m, s):
    dd = float(d) + (float(m) / 60) + (float(s) / (60 * 60))
    if (not bool):
        dd *= -1
    return dd

def checkSystem(system):
    global s

    if not 'distance' in system:
        return
    if isinstance(system, OrderedDict):
        addToSystem(system)
        s += 1
        checkStar(system, system['star'])
    else:
        print("h")
        for star in system:
            checkStar(system, star)

def checkStar(system, star):
    global st
    if isinstance(star, OrderedDict):
        addToStar(system, star);
        st += 1
        checkPlanet(star, star['planet'])
    else:
        for planet in star:
            addToStar(system, star)
            st += 1
            checkPlanet(star, planet)

def checkPlanet(star, planet):
    global p
    if isinstance(planet, OrderedDict):
            addToPlanet(star, planet)
            p += 1
    else:
        for pl in planet:
            addToPlanet(star, pl)
            p += 1

def addToPlanet(star, planet):
    name = planet['name'][0]

    if isinstance(planet['temperature'], OrderedDict):
        temp = str(planet['temperature']['#text'])
    else:
        temp = str(planet['temperature'])
        
    if isinstance(planet['radius'], OrderedDict):
        radius = str(planet['radius']['#text'])
    else:
        radius = str(planet['radius'])

    if isinstance(planet['period'], OrderedDict):
        period = str(planet['period']['#text'])
    else:
        period = str(planet['period'])

    values = str(s) + ",'" + name + "'," + period + "," + radius + "," + temp

    cursor.execute("INSERT INTO Planet(systemID, name, period, radius, temp) VALUES("+values+")")
    cursor.execute("INSERT INTO StarPlanet(starID, planetID) VALUES("+ str(st) + "," + str(p) + ")")
    return;

def addToStar(system, star):
    name = star['name'][0]
    
    if 'temperature' in star:
        if isinstance(star['temperature'], OrderedDict):
            temp = str(star['temperature']['#text'])
        else:
            temp = str(star['temperature'])
    else:
        temp =  str(0)
 
    if isinstance(star['radius'], OrderedDict):
        radius = str(star['radius']['#text'])
    else:
        radius = str(star['radius'])

    #print(name)

    values = "'" + name + "'," + radius +"," + temp
    cursor.execute("INSERT INTO Star(name, radius, temp) VALUES("+values+")")
    cursor.execute("INSERT INTO SystemStar(starID, systemID) VALUES("+ str(st) + "," + str(s) +")")

def addToSystem(system):
    name = str(system['name'])
    decLat = str(system['declination']);
    ascLong = str(system['rightascension']);
    dist = str(system['distance'])

    sign,d,m,s=parseDMSDec(decLat)
    hh,mm,ss=parseHMSAsc(ascLong)
    decNum=convertDMSToDD(sign,d,m,s)
    ascNum=convertHMSToDD(hh,mm,ss)
    
    values = "'" + name + "'," + str(decNum) + "," + str(ascNum) + "," + dist
    cursor.execute("INSERT INTO Systems(name, decLat, ascLong, dist) VALUES(" + values + ")")

for file in os.listdir(path):
    if file.endswith(".xml"):
        xmlpath = os.path.join(path, file)
        xmlfile = open(xmlpath, "r")
        xmlstr = xmlfile.read()
        xmlfile.close()
        o = xmltodict.parse(xmlstr)
        checkSystem(o['system'])     


conn.commit()
conn.close()
