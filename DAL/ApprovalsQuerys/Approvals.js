const pool = require('../configuration/ConfigurationDB');

function getApprovalsForColors(idProduct){

    let sqlString = `select 'ColorsApprovals' Tipo,
    status.DESCRIPTION Estado, CONCAT(user_impacta.NAME, " " , user_impacta.LAST_NAME) Responsable, combo_fabric.DATE_STATUS_COLOR Fecha
    from 
    combo_fabric, product, status, user_impacta
    WHERE
    combo_fabric.ID_PRODUCT = product.ID AND
    combo_fabric.ID_STATUS_COLOR = status.ID AND
    user_impacta.ID = combo_fabric.ID_USER_COLOR AND
    combo_fabric.ID_PRODUCT = ${idProduct}
    ORDER BY combo_fabric.DATE_STATUS_COLOR DESC
    LIMIT 1`;

          return new Promise(function(resolve, reject) {
          pool.query(sqlString, function (err, rows, fields) {
              if (err) {
                  return reject("error" + err.code);
              }
              resolve(rows);
          });
      });
    }

    function getApprovalsForPrints(idProduct){

        let sqlString = `select 'PrintsApprovals' Tipo,
        status.DESCRIPTION Estado, CONCAT(user_impacta.NAME, " " , user_impacta.LAST_NAME) Responsable, combo_fabric.DATE_STATUS_PRINT Fecha
        from 
        combo_fabric, product, status, user_impacta
        WHERE
        combo_fabric.ID_PRODUCT = product.ID AND
        combo_fabric.ID_STATUS_PRINT = status.ID AND
        user_impacta.ID = combo_fabric.ID_USER_PRINT AND
        combo_fabric.ID_PRODUCT = ${idProduct}
        ORDER BY combo_fabric.DATE_STATUS_PRINT DESC
        LIMIT 1`;
    
              return new Promise(function(resolve, reject) {
              pool.query(sqlString, function (err, rows, fields) {
                  if (err) {
                      return reject("error" + err.code);
                  }
                  resolve(rows);
              });
          });
        }

        function getApprovalsForAvios(idProduct){

            let sqlString = `select 'AviosApprovals' Tipo,
            status.DESCRIPTION Estado, CONCAT(user_impacta.NAME, " " , user_impacta.LAST_NAME) Responsable,  combo_avio.STATUS_DATE Fecha
            from 
            combo_avio, product, status, user_impacta
            WHERE
            combo_avio.ID_PRODUCT = product.ID AND
            combo_avio.ID_STATUS = status.ID AND
            user_impacta.ID = combo_avio.ID_USER AND
            combo_avio.ID_PRODUCT = ${idProduct}
            ORDER BY combo_avio.STATUS_DATE DESC
            limit 1 `;
        
                  return new Promise(function(resolve, reject) {
                  pool.query(sqlString, function (err, rows, fields) {
                      if (err) {
                          return reject("error" + err.code);
                      }
                      resolve(rows);
                  });
              });
            }

            function getApprovalsForQualities(idProduct){

                let sqlString = `select 'QualitiesApprovals' Tipo,
                status.DESCRIPTION Estado, CONCAT(user_impacta.NAME, " " , user_impacta.LAST_NAME) Responsable, combo_fabric.DATE_STATUS Fecha
                from 
                combo_fabric, product, status, user_impacta
                WHERE
                combo_fabric.ID_PRODUCT = product.ID AND
                combo_fabric.ID_STATUS = status.ID AND
                user_impacta.ID = combo_fabric.ID_USER AND
                combo_fabric.ID_PRODUCT = ${idProduct}
                ORDER BY combo_fabric.DATE_STATUS DESC
                LIMIT 1 `;
            
                      return new Promise(function(resolve, reject) {
                      pool.query(sqlString, function (err, rows, fields) {
                          if (err) {
                              return reject("error" + err.code);
                          }
                          resolve(rows);
                      });
                  });
                }


function getApprovals(idProduct){

    return new Promise(function (resolve, reject) {
    let colorsApprovals;
    let printsApprovals;
    let aviosApprovals;
    let qualitiesApprovals;

    getApprovalsForAvios(idProduct).then(result => {
        aviosApprovals = result[0];
        getApprovalsForColors(idProduct).then(result => {
            colorsApprovals = result[0];
            getApprovalsForPrints(idProduct).then(result => {
                printsApprovals = result[0];
                getApprovalsForQualities(idProduct).then(result => {
                    qualitiesApprovals = result[0];
                    let approvals = [];
                    approvals.push(aviosApprovals, colorsApprovals, printsApprovals, qualitiesApprovals)
                    //let approvals = {ColorsApprovals: colorsApprovals, PrintsApprovals: printsApprovals, AviosApprobals: aviosApprovals, qualitiesApprovals}
                    resolve(approvals);
                })
            })
        })
    })
    }      
)};      

    module.exports.getApprovals = getApprovals;