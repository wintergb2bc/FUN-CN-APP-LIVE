export const viewStyle = `
<style>
body {
    padding: 0;
    margin: 0;
    color: #ABA79D;
    width: 100%;
    background: #17191C;
    padding-bottom: 30px;
}
caption {
    color: #ABA79D;
    font-size: 14px;
    text-align: left;
    padding-left: 15px;
    margin-top: 15px;
    margin-bottom: 15px;
}
.caption {
  color: #ABA79D;
    font-size: 14px;
    text-align: left;
    padding-left: 15px;
    margin-top: 15px;
    margin-bottom: 15px;
}
.table2 caption{
  margin-bottom: 10px
}
table {
    border-spacing: 0px;
}
.table0 caption{
  padding-top: 15px;
}
.table0 td {
    padding: 0px;
    font-size: 12px;
}

.table0 td{
    padding-left: 15px;
    padding-right: 15px;
}

.Banner{
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 100%;
    overflow: auto;
}
.Banner img {
    max-width: 91%;
    max-height: 91%;
    display: block;
    margin: auto;
} 


.table2 table td {
    text-align: center;
}
.table2 table{
    border-collapse: collapse;
}
.table2 table tr {
    border-bottom: 1px solid #393B40;
}
.table2 table tr:last-child {
    border-bottom: 0px solid #DF1B15;
}
.table2 table tr td {
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 12px;
    color: #ABA79D;
}
.table2 table {
    width: 100%;
    background: #2D2F33;
    border-radius: 10px;
    color: #000;
    text-align: center;
    border-color: #454E5A;
}
.table2 table tbody>:first-child td {
    color: #D6D1C2;
    font-weight: bold;
    font-size: 12px;
}


.table2 :not(:first-child)>tr>td{
    padding: 15px;
    padding-top: 0px;
    font-size: 12px;
}

.tab2Table3 table {
    width: 100%;
    background: #2D2F33;
    border-radius: 10px;
    color: #000;
    text-align: center;
    border-color: #454E5A;
}
.tab2Table3 table tbody>:first-child td {
    color: #D6D1C2;
    font-weight: bold;
    font-size: 12px;
}


.tab2Table3 :not(:first-child)>tr>td{
    padding: 15px;
    padding-top: 0px;
    font-size: 12px;
}


.table3 td{
    padding: 15px;
    padding-top: 0px;
}
.table4 td{
    padding: 15px;
    padding-top: 0px;
}
.line {
 background-color: #2A2A2A;
    height: 1px;
    width: 95%;
    margin: 0 auto;
    /*margin-top: 15px;*/
}


.tab2Table0 table td, {
    text-align: center;
}
.tab2Table0{
    width: 100%;
}
.tab2Table0 table{
    border-collapse: collapse;
}
.tab2Table0 table tr {
    border-bottom: 1px solid #393B40;
}
.tab2Table0 table tr:last-child {
    border-bottom: 0px solid #DF1B15;
}
.tab2Table0 table tr td {
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 12px;
    color: #ABA79D;
}
.tab2Table0 table {
    width: 100%;
    background: #2D2F33;
    border-radius: 10px;
    color: #000;
    text-align: center;
    border-color: #454E5A;
}
.tab2Table0 table tbody>:first-child td {
    color: #D6D1C2;
    font-weight: bold;
    font-size: 12px;
}


.tab2Table0 :not(:first-child)>tr>td{
    padding: 15px;
    padding-top: 0px;
    font-size: 12px;
}

.tab2Table0 td {
    padding: 0px;
    font-size: 12px;
}

.tab2Table0 td{
    padding-left: 15px;
    padding-right: 15px;
}

.tab2Table1 table td, {
    text-align: center;
}
.tab2Table1{
    width: 100%;
}
.tab2Table1 table{
    border-collapse: collapse;
}
.tab2Table1 table tr {
    border-bottom: 1px solid #393B40;
}
.tab2Table1 table tr:last-child {
    border-bottom: 0px solid #DF1B15;
}
.tab2Table1 table tr td {
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 12px;
    color: #ABA79D;
}
.tab2Table1 table {
    width: 100%;
    background: #2D2F33;
    border-radius: 10px;
    color: #000;
    text-align: center;
    border-color: #454E5A;
}
.tab2Table1 table tbody>:first-child td {
    color: #D6D1C2;
    font-weight: bold;
    font-size: 12px;
}


.tab2Table1 :not(:first-child)>tr>td{
    padding: 15px;
    padding-top: 0px;
    font-size: 12px;
}

.tab2Table1 td {
    padding: 0px;
    font-size: 12px;
}

.tab2Table1 td{
    padding-left: 15px;
    padding-right: 15px;
}

.tab2Table2{
    width: 100%;
    margin: 0;
    padding: 0
}

.tab2Table2 caption{
        margin-top: 0;
    margin-bottom: 0;
}

.tab2Table2 tbody{
       display: none;
}


.accordion{
padding-left: 15px;
    padding-right: 15px;
}

.accordion details:first-child {
      color: #d6d1c2;
    font-size: .875rem;
}
.accordion details {
  /*border-bottom: 1px solid grey;*/
  /*padding: 10px 0;*/
    background-color: #2d2f33;
    margin: 0.625rem 0;
    padding-top: 13px;
    padding-bottom: 13px;
    padding-left: 15px;
    padding-right: 15px;
    border-radius: 0.5rem;
}

.accordion details > summary {
  /*padding: 7px 0 4px 0;*/
  /*cursor: pointer;*/
  font-weight: bold;
  color: #d6d1c2;
    font-size: .875rem;
  list-style: none;
  outline: none;
  align-items: center;
    line-height: 16px;
    padding-right: 25px;
    cursor: pointer;
    position: relative;
}


.accordion details > summary::-webkit-details-marker {
  display: none;
}

.accordion details .answer {
  padding: 20px 0 0 0;
      color: #d6d1c2;
    font-size: .875rem;

}

.accordion details a{
  padding: 20px 0 0 0;
      color: #d6d1c2;
    font-size: .875rem;

}

.arrow{
    transform: rotate(180deg);
    position: absolute;
    top: -6px;
    right: 4px;
}

.accordion details[open] .arrow{
    transform: rotate(0deg);
}
.generalMember {
    margin-top: 20px;
    margin-bottom: 5px;
}

.generalMember td{    
  padding-bottom: 15px;
}

</style>
`;
