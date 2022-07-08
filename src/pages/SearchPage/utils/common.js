//1940 Federal Census 
export const checkBirthPlace = (values) => {
  if (values["BirthPlace"]) {
    const { name, id } = values["BirthPlace"];
    values["b"]["l"]["l"] = name ? name : "";
    values["b"]["li"]["i"] = id ? id : "";
    delete values["BirthPlace"];
  }
};
export const checkRSPlace = (values) => {
  if (values["RSPlace"]) {
    const { name, id } = values["RSPlace"];
    values["r"]["l"]["l"] = name ? name : "";
    values["r"]["li"]["i"] = id ? id : "";
    delete values["RSPlace"];
  }
};
export const checkRSPPlace = (values) => {
  if (values["RSPPlace"]) {
    const { name, id } = values["RSPPlace"];
    values["pr"]["l"]["l"] = name ? name : "";
    values["pr"]["li"]["i"] = id ? id : "";
    delete values["RSPPlace"];
  }
};
export const updateBirthPlace = (_values) => {
  let obj = {};
  if (_values?.b?.li?.i) {
    const levelData = _values.BirthPlace.levelData;
    obj = {
      b: {
        li: {
          i: levelData?.residenceId[levelData.residenceLevel[_values.b.li.s]],
          s: _values.b.li.s,
        },
        l: {
          l: _values.b.l.l,
          s: _values.b.l.s,
        },
        y: {
          y: _values.b.y.y,
          s: _values.b.y.s
        }
      },
    };
  } else if (_values?.b?.l?.l) {
    obj = {
      b: {
        l: {
          l: _values.b.l.l,
          s: _values.b.l.s,
        },
        y: {
          y: _values.b.y.y,
          s: _values.b.y.s
        }
      },
    };
  } else {
    delete _values.b.li;
    delete _values.b.l;
  }
  if (_values.BirthPlace) {
    delete _values.BirthPlace;
  }
  return obj;
};

export const updateRSPlace = (_values) => {
  let obj = {};
  if (_values?.r?.li?.i) {
    const levelData = _values.RSPlace.levelData;
    obj = {
      r: {
          li: {
            i: levelData?.residenceId[
              levelData.residenceLevel[_values.r?.li.s]
            ],
            s: _values.r.li.s,
          },
          l: {
            l: _values.r.l.l,
            s: _values.r.l.s,
          },
        },
    };
  } else if (_values?.r?.l?.l) {
    obj = {
      r: {
          l: {
            s: _values.r.l.s,
            l: _values.r.l.l,
          },
      },
    };
  } else {
    delete _values.r.l;
    delete _values.r.li;
  }
  if (_values.RSPlace) {
    delete _values.RSPlace;
  }
  return obj;
};

export const updateRSPPlace = (_values) => {
  let obj = {};
  if (_values?.pr?.li?.i) {
    const levelData = _values.RSPPlace.levelData;
    obj = {
      pr: {
          li: {
            i: levelData?.residenceId[
              levelData.residenceLevel[_values.pr?.li.s]
            ],
            s: _values.pr.li.s,
          },
          l: {
            s: _values.pr.l.s,
            l: _values.pr.l.l,
          },
      },
    };
  } else if (_values?.pr?.l?.l) {
    obj = {
      pr: {
          l: {
            s: _values.pr.l.s,
            l: _values.pr.l.l,
          },
        },
    };
  } else {
    delete _values.pr.l;
    delete _values.pr.li;
  }
  if (_values.RSPPlace) {
    delete _values.RSPPlace;
  }
  return obj;
};

//WWII

export const checkEnlist = (values) => {
  if (values["Enlist"]) {
    const { name, id } = values["Enlist"];
    values["ep"]["l"]["l"] = name ? name : "";
    values["ep"]["li"]["i"] = id ? id : "";
    delete values["Enlist"];
  }
};

export const checkEnlistNew = (values) => {
  if (values["Enlist"]) {
    const { name, id } = values["Enlist"];
    values["e"]["l"]["l"] = name ? name : "";
    values["e"]["li"]["i"] = id ? id : "";
    delete values["Enlist"];
  }
};
export const checkState = (values) => {
  if (values["State"]) {
    const { name, id } = values["State"];
    values["s"]["l"]["l"] = name ? name : "";
    values["s"]["li"]["i"] = id ? id : "";
    delete values["State"];
  }
};

export const checkResidence = (values) => {
  if (values["Residence"]) {
    const { name, id } = values["Residence"];
    values["sr"]["l"]["l"] = name ? name : "";
    values["sr"]["li"]["i"] = id ? id : "";
    delete values["Residence"];
  }
};

export const updateEnlistPlace = (_values) => {
  let obj = {};
  if (_values?.ep?.li?.i) {
    const levelData = _values.Enlist.levelData;
    obj = {
      ep: {
        li: {
          i: levelData?.residenceId[levelData.residenceLevel[_values.ep.li.s]],
          s: _values.ep.li.s,
        },
        l: {
          l: _values.ep.l.l,
          s: _values.ep.l.s,
        },
      },
    };
  } else if (_values?.ep?.l?.l) {
    obj = {
      ep: {
        l: {
          l: _values.ep.l.l,
          s: _values.ep.l.s,
        },
      },
    };
  } else {
    delete _values.ep.li;
    delete _values.ep.l;
  }
  if (_values.Enlist) {
    delete _values.Enlist;
  }
  return obj;
};

export const updateEnlistPlaceNew = (_values) => {
  let obj = {};
  if (_values?.e?.li?.i) {
    const levelData = _values.Enlist.levelData;
    obj = {
      e: {
        li: {
          i: levelData?.residenceId[levelData.residenceLevel[_values.e.li.s]],
          s: _values.e.li.s,
        },
        l: {
          l: _values.e.l.l,
          s: _values.e.l.s,
        },
      },
    };
  } else if (_values?.e?.l?.l) {
    obj = {
      e: {
        l: {
          l: _values.e.l.l,
          s: _values.e.l.s,
        },
      },
    };
  } else {
    delete _values.e.li;
    delete _values.e.l;
  }
  if (_values.Enlist) {
    delete _values.Enlist;
  }
  return obj;
};

export const updateStatePlace = (_values) => {
  let obj = {};
  if (_values?.s?.li?.i) {
    const levelData = _values.State.levelData;
    obj = {
      b: {
        li: {
          i: levelData?.residenceId[levelData.residenceLevel[_values.s.li.s]],
          s: _values.s.li.s,
        },
        l: {
          l: _values.s.l.l,
          s: _values.s.l.s,
        },
      },
    };
  } else if (_values?.s?.l?.l) {
    obj = {
      b: {
        l: {
          l: _values.s.l.l,
          s: _values.s.l.s,
        },
      },
    };
  } else {
    delete _values.s.li;
    delete _values.s.l;
  }
  if (_values.State) {
    delete _values.State;
  }
  return obj;
};

export const updateResidence = (_values) => {
  let obj = {};
  if (_values?.sr?.li?.i) {
    const levelData = _values.Residence.levelData;
    obj = {
      sr: {
        li: {
          i: levelData?.residenceId[levelData.residenceLevel[_values.sr.li.s]],
          s: _values.sr.li.s,
        },
        l: {
          l: _values.sr.l.l,
          s: _values.sr.l.s,
        },
        y: {
          y: _values.sr.y.y,
          m: _values.sr.y.m,
          d: _values.sr.y.d,
          s: _values.sr.y.s
        },
      },
    };
  } else if (_values?.sr?.l?.l) {
    obj = {
      sr: {
        l: {
          l: _values.sr.l.l,
          s: _values.sr.l.s,
        },
        y: {
          y: _values.sr.y.y,
          m: _values.sr.y.m,
          d: _values.sr.y.d,
          s: _values.sr.y.s
        },
      },
    };
  } else {
    delete _values.sr.li;
    delete _values.sr.l;
  }
  if (_values.Residence) {
    delete _values.Residence;
  }
  return obj;
};

//German and Irish

export const checkResPlace = (values) => {
  if (values["Res"]) {
    const { name, id } = values["Res"];
    values["pr"]["l"]["l"] = name ? name : "";
    values["pr"]["li"]["i"] = id ? id : "";
    delete values["Res"];
  }
};

export const checkPDepartPlace = (values) => {
  if (values["PDepart"]) {
    const { name, id } = values["PDepart"];
    values["d"]["l"]["l"] = name ? name : "";
    values["d"]["li"]["i"] = id ? id : "";
    delete values["PDepart"];
  }
};
export const checkIDestPlace = (values) => {
  if (values["IDest"]) {
    const { name, id } = values["IDest"];
    values["id"]["l"]["l"] = name ? name : "";
    values["id"]["li"]["i"] = id ? id : "";
    delete values["IDest"];
  }
};
export const updateResPlace = (_values) => {
  let obj = {};
  if (_values?.pr?.li?.i) {
    const levelData = _values.Res.levelData;
    obj = {
      pr: {
        li: {
          i: levelData?.residenceId[levelData.residenceLevel[_values.pr.li.s]],
          s: _values.pr.li.s,
        },
        l: {
          l: _values.pr.l.l,
          s: _values.pr.l.s,
        },
      },
    };
  } else if (_values?.pr?.l?.l) {
    obj = {
      pr: {
        l: {
          l: _values.pr.l.l,
          s: _values.pr.l.s,
        },
      },
    };
  } else {
    delete _values.pr.li;
    delete _values.pr.l;
  }
  if (_values.Res) {
    delete _values.Res;
  }
  return obj;
};

export const updatePDepartPlace = (_values) => {
  let obj = {};
  if (_values?.d?.li?.i) {
    const levelData = _values.PDepart.levelData;
    obj = {
      d: {
        li: {
          i: levelData?.residenceId[levelData.residenceLevel[_values.d.li.s]],
          s: _values.d.li.s,
        },
        l: {
          l: _values.d.l.l,
          s: _values.d.l.s,
        },
      },
    };
  } else if (_values?.d?.l?.l) {
    obj = {
      d: {
        l: {
          l: _values.d.l.l,
          s: _values.d.l.s,
        },
      },
    };
  } else {
    delete _values.d.li;
    delete _values.d.l;
  }
  if (_values.PDepart) {
    delete _values.PDepart;
  }
  return obj;
};
export const updateIDestPlace = (_values) => {
  let obj = {};
  if (_values?.id?.li?.i) {
    const levelData = _values.IDest.levelData;
    obj = {
      id: {
        li: {
          i: levelData?.residenceId[levelData.residenceLevel[_values.id.li.s]],
          s: _values.id.li.s,
        },
        l: {
          l: _values.id.l.l,
          s: _values.id.l.s,
        },
      },
    };
  } else if (_values?.id?.l?.l) {
    obj = {
      id: {
        l: {
          l: _values.id.l.l,
          s: _values.id.l.s,
        },
      },
    };
  } else {
    delete _values.id.li;
    delete _values.id.l;
  }
  if (_values.IDest) {
    delete _values.IDest;
  }
  return obj;
};

//Russian

export const arrivalPlace = (valuesData) => {
  if (valuesData["ArrivalPlace"]) {
    const { name, id } = valuesData["ArrivalPlace"];
    valuesData["a"]["l"]["l"] = name ? name : "";
    valuesData["a"]["li"]["i"] = id ? id : "";
    delete valuesData["ArrivalPlace"];
  }
};
export const portPlace = (valuesData) => {
  if (valuesData["Port"]) {
    const { name, id } = valuesData["Port"];
    valuesData["pe"]["l"]["l"] = name ? name : "";
    valuesData["pe"]["li"]["i"] = id ? id : "";
    delete valuesData["Port"];
  }
};
export const resPlace = (valuesData) => {
  if (valuesData["Res"]) {
    const { name, id } = valuesData["Res"];
    valuesData["r"]["l"]["l"] = name ? name : "";
    valuesData["r"]["li"]["i"] = id ? id : "";
    delete valuesData["Res"];
  }
};

export const departPlace = (valuesData) => {
  if (valuesData["Depart"]) {
    const { name, id } = valuesData["Depart"];
    valuesData["d"]["l"]["l"] = name ? name : "";
    valuesData["d"]["li"]["i"] = id ? id : "";
    delete valuesData["Depart"];
  }
};



export const updateArrivalPlace = (_values) => {
  let obj = {};
  if (_values?.a?.li?.i) {
    const levelData = _values.ArrivalPlace.levelData;
    obj = {
      a: {
        li: {
          i: levelData?.residenceId[levelData.residenceLevel[_values.a.li.s]],
          s: _values.a.li.s,
        },
        l: {
          l: _values.a.l.l,
          s: _values.a.l.s,
        },
      },
    };
  } else if (_values?.a?.l?.l) {
    obj = {
      a: {
        l: {
          l: _values.a.l.l,
          s: _values.a.l.s,
        },
      },
    };
  } else {
    delete _values.a.li;
    delete _values.a.l;
  }
  if (_values.ArrivalPlace) {
    delete _values.ArrivalPlace;
  }
  return obj;
};

export const updatePortPlace = (_values) => {
  let obj = {};
  if (_values?.pe?.li?.i) {
    const levelData = _values.Port.levelData;
    obj = {
      pe: {
        li: {
          i: levelData?.residenceId[levelData.residenceLevel[_values.pe.li.s]],
          s: _values.pe.li.s,
        },
        l: {
          l: _values.pe.l.l,
          s: _values.pe.l.s,
        },
      },
    };
  } else if (_values?.pe?.l?.l) {
    obj = {
      pe: {
        l: {
          l: _values.pe.l.l,
          s: _values.pe.l.s,
        },
      },
    };
  } else {
    delete _values.pe.li;
    delete _values.pe.l;
  }
  if (_values.Port) {
    delete _values.Port;
  }
  return obj;
};

export const updateResidencePlace = (_values) => {
  let obj = {};
  if (_values?.r?.li?.i) {
    const levelData = _values.Res.levelData;
    obj = {
      r: {
        li: {
          i: levelData?.residenceId[levelData.residenceLevel[_values.r.li.s]],
          s: _values.r.li.s,
        },
        l: {
          l: _values.r.l.l,
          s: _values.r.l.s,
        },
      },
    };
  } else if (_values?.r?.l?.l) {
    obj = {
      r: {
        l: {
          l: _values.r.l.l,
          s: _values.r.l.s,
        },
      },
    };
  } else {
    delete _values.r.li;
    delete _values.r.l;
  }
  if (_values.Res) {
    delete _values.Res;
  }
  return obj;
};

export const updateDepartPlace = (departValues) => {
  let obj = {};
  if (departValues?.d?.li?.i) {
    const levelData = departValues.Depart.levelData;
    obj = {
      d: {
        li: {
          i: levelData?.residenceId[levelData.residenceLevel[departValues.d.li.s]],
          s: departValues.d.li.s,
        },
        l: {
          l: departValues.d.l.l,
          s: departValues.d.l.s,
        },
      },
    };
  } else if (departValues?.d?.l?.l) {
    obj = {
      d: {
        l: {
          l: departValues.d.l.l,
          s: departValues.d.l.s,
        },
      },
    };
  } else {
    delete departValues.d.li;
    delete departValues.d.l;
  }
  if (departValues.Depart) {
    delete departValues.Depart;
  }
  return obj;
};


export const checkMarriagePlace = (values) => {
  if (values["Marriage"]) {
    const { name, id } = values["Marriage"];
    values["m"]["l"]["l"] = name ? name : "";
    values["m"]["li"]["i"] = id ? id : "";
    delete values["Marriage"];
  }
};

export const updateMarriagePlace = (_values) => {
  let marriageObj = {};
  if (_values?.m?.li?.i) {
      const levelData = _values.Marriage.levelData;
      marriageObj = {
          m: {
              y: {
                  y: _values.m.y.y,
                  m: _values.m.y.m,
                  d: _values.m.y.d,
                  s: _values.m.y.s
              },
              li: {
                  i: levelData?.residenceId[levelData.residenceLevel[_values.m.li.s]],
                  s: _values.m.li.s,
              },
              l: {
                  l: _values.m.l.l,
                  s: _values.m.l.s,
              },
          },
      };
  } else if (_values?.m?.l?.l) {
      marriageObj = {
          m: {
              l: {
                  l: _values.m.l.l,
                  s: _values.m.l.s,
              },
              y: {
                  y: _values.m.y.y,
                  m: _values.m.y.m,
                  d: _values.m.y.d,
                  s: _values.m.y.s
              },
          },
      };
  } else {
      delete _values.m.li;
      delete _values.m.l;
  }
  if (_values.Marriage) {
      delete _values.Marriage;
  }
  return marriageObj;
};

export const checkResidencePlace = (values) => {
  if (values["Residence"]) {
    const { name, id } = values["Residence"];
    values["r"]["l"]["l"] = name ? name : "";
    values["r"]["li"]["i"] = id ? id : "";
    delete values["Residence"];
  }
};

export const updateResidenceField = (_values) => {
  let residenceObj = {};
  if (_values?.r?.li?.i) {
      const levelData = _values.Residence.levelData;
      residenceObj = {
          r: {
              li: {
                  i: levelData?.residenceId[levelData.residenceLevel[_values.r.li.s]],
                  s: _values.r.li.s,
              },
              l: {
                  l: _values.r.l.l,
                  s: _values.r.l.s,
              },
          },
      };
  } else if (_values?.r?.l?.l) {
      residenceObj = {
          r: {
              l: {
                  l: _values.r.l.l,
                  s: _values.r.l.s,
              },
          },
      };
  } else {
      delete _values.r.li;
      delete _values.r.l;
  }
  if (_values.Residence) {
      delete _values.Residence;
  }
  return residenceObj;
};

export const checkDeathPlace = (values) => {
  if (values["Death"]) {
    const { name, id } = values["Death"];
    values["d"]["l"]["l"] = name ? name : "";
    values["d"]["li"]["i"] = id ? id : "";
    delete values["Death"];
  }
};

export const updateDeathPlace = (_values) => {
  let obj = {};
  if (_values?.d?.li?.i) {
      const levelData = _values.Death.levelData;
      obj = {
          d: {
              li: {
                  i: levelData?.residenceId[levelData.residenceLevel[_values.d.li.s]],
                  s: _values.d.li.s,
              },
              l: {
                  l: _values.d.l.l,
                  s: _values.d.l.s,
              },
              y: {
                  y: _values.d.y.y,
                  s: _values.d.y.s
              },
          },
      };
  } else if (_values?.d?.l?.l) {
      obj = {
          d: {
              l: {
                  l: _values.d.l.l,
                  s: _values.d.l.s,
              },
              y: {
                  y: _values.d.y.y,
                  s: _values.d.y.s
              },
          },
      };
  } else {
      delete _values.d.li;
      delete _values.d.l;
  }
  if (_values.Death) {
      delete _values.Death;
  }
  return obj;
};