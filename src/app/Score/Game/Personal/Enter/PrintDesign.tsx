'use client'
// import './print.css'
export default function Loading() {
  var width1 = 110
  var fontsiteAll = 17
  var fontSiteTitle = 17
  var heightRow = 25
  return (
    <div id='component_print2' style={{ padding: '2px', paddingTop: '10px', display: 'none' }}>
      <div style={{ display: 'flex' }}>
        <img style={{ width: 75, paddingLeft: 5 }} src={require('./icon.png')} />
        <h2 style={{ paddingLeft: 10, marginTop: 'auto', marginBottom: 'auto', color: 'red' }}>Thông tin đơn hàng</h2>
      </div>

      <table>
        <tbody>
          <tr style={{ fontSize: fontsiteAll, height: heightRow }}>
            <td style={{ fontSize: fontSiteTitle, width: width1, fontStyle: 'italic' }}>Khách hàng:</td>
            <td style={{ fontWeight: 'bold' }}>TenKhachHang</td>
          </tr>
          <tr style={{ fontSize: fontsiteAll, height: heightRow }}>
            <td style={{ fontSize: fontSiteTitle, width: width1, fontStyle: 'italic' }}>Số hợp đồng:</td>
            <td style={{ fontWeight: 'bold' }}>SoHopDong</td>
          </tr>
          <tr style={{ fontSize: fontsiteAll, height: heightRow }}>
            <td style={{ fontSize: fontSiteTitle, width: width1, fontStyle: 'italic' }}>Lot No:</td>
            <td style={{ fontWeight: 'bold' }}>LotNo</td>
          </tr>
          <tr style={{ fontSize: fontsiteAll, height: heightRow }}>
            <td style={{ fontSize: fontSiteTitle, width: width1, fontStyle: 'italic' }}>Tên hàng:</td>
            <td style={{ fontWeight: 'bold' }}>TenHang</td>
          </tr>
          <tr style={{ fontSize: fontsiteAll, height: heightRow }}>
            <td style={{ fontSize: fontSiteTitle, width: width1, fontStyle: 'italic' }}>Kích thước:</td>
            <td style={{ fontWeight: 'bold' }}>KichThuoc</td>
          </tr>
          <tr style={{ fontSize: fontsiteAll, height: heightRow }}>
            <td style={{ fontSize: fontSiteTitle, width: width1, fontStyle: 'italic' }}>Số lượng / TL:</td>
            <td style={{ fontWeight: 'bold' }}>SoLuong</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
