from collections import OrderedDict

import xmltodict, json
import sqlite3
import os

conn = sqlite3.connect(":memory:")
cursor = conn.cursor()

#Relational tables
cursor.execute("CREATE TABLE Star (starID INTEGER PRIMARY KEY, name STRING, decLat FLOAT, ascLong FLOAT, dist FLOAT)")
cursor.execute("CREATE TABLE Planet (planetID INTEGER PRIMARY KEY, name STRING)")
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

path = "C:\\Users\\Sar0o2a\\WebstormProjects\\exoPProject\\CUHacking\\data\\systems_kepler"

s = 0
st = 0
p = 0



def checkSystem(system):
    global s
    if isinstance(system, OrderedDict):
        addToSystem(system)
        s += 1
        checkStar(system, system['star'])
    else:
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
    cursor.execute("INSERT INTO Planet(name) VALUES('"+planet['name'][0]+"')")
    cursor.execute("INSERT INTO StarPlanet(starID, planetID) VALUES("+ str(st) + "," + str(p) + ")")
    return;

def addToStar(system, star):
    cursor.execute("INSERT INTO Star(name, decLat, ascLong, dist) VALUES('"+ star['name'][0] + "'," + str(0) + "," + str(0) + "," + str(0) +")")
    cursor.execute("INSERT INTO SystemStar(starID, systemID) VALUES("+ str(st) + "," + str(s) +")")
    return;

def addToSystem(system):
    name = str(system['name'])
    cursor.execute("INSERT INTO Systems(name, decLat, ascLong, dist) VALUES('"+name+ "'," + str(0) + "," + str(0) + "," + str(0) + ")")
    return

for file in os.listdir(path):
    if file.endswith(".xml"):
        xmlpath = os.path.join(path, file)
        xmlfile = open(xmlpath, "r")
        xmlstr = xmlfile.read()
        xmlfile.close()
        o = xmltodict.parse(xmlstr)
        checkSystem(o['system'])

for row in cursor.execute('SELECT * FROM StarPlanet'):
    print(row)





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


def parseDMSAsc(dmsString):

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

# checking validity of parsing
d,m,ss=parseDMSAsc("01 22 50.938")
print("Parsing Asc: ", d,m,ss)
sign,dd,mm,sss=parseDMSDec("-24 39 50.65")
print("Parsing Dec: ", sign, dd, mm, sss)