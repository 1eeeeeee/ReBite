import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, ScrollView, 
  TouchableOpacity, SafeAreaView, Alert 
} from 'react-native';

const MerchantView = ({ onLogout }) => {
  // ---------------------------------------------------------
  // 訂單狀態管理 (目前為模擬數據)
  // ---------------------------------------------------------
  const [orders, setOrders] = useState([
    { id: '21', customer: '林小姐', items: '歐式酸種麵包', price: 88, time: '10 mins ago' },
    { id: '25', customer: '張先生', items: '手工草莓塔', price: 120, time: '25 mins ago' },
  ]);

  const confirmPickup = (id) => {
    Alert.alert("確認完成", `訂單 #${id} 已順利取貨！`, [
      { text: "確定", onPress: () => setOrders(orders.filter(order => order.id !== id)) }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 頂部導覽列 */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Text style={styles.logoIcon}>🍃</Text>
          <Text style={styles.logoText}>ReBite</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>商家後台</Text>
          </View>
          <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutBtnText}>🚪 登出</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 店家標題資訊 */}
        <View style={styles.titleSection}>
          <View>
            <Text style={styles.shopName}>Green Bakery</Text>
            <Text style={styles.subText}>今日已達成 $2,480 惜食交易</Text>
          </View>
          <TouchableOpacity style={styles.addItemBtn}>
            <Text style={styles.addItemText}>＋ 新增剩餘品項</Text>
          </TouchableOpacity>
        </View>

        {/* 歡迎橫幅 */}
        <View style={styles.welcomeBanner}>
          <Text style={styles.bannerText}>⚡ 商家合作模式已啟動</Text>
        </View>

        {/* 主要功能區 (訂單與掃描) */}
        <View style={styles.mainContent}>
          
          {/* 左側：待領取訂單 */}
          <View style={styles.orderSection}>
            <Text style={styles.sectionTitle}>🕒 待領取訂單</Text>
            {orders.length > 0 ? (
              orders.map(order => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderIdBox}>
                    <Text style={styles.orderIdText}>{order.id}</Text>
                  </View>
                  <View style={styles.orderInfo}>
                    <Text style={styles.customerName}>{order.customer}</Text>
                    <Text style={styles.orderDetail}>{order.items}</Text>
                    <Text style={styles.orderTime}>{order.time} • ${order.price}</Text>
                  </View>
                  <TouchableOpacity style={styles.confirmBtn} onPress={() => confirmPickup(order.id)}>
                    <Text style={styles.confirmBtnText}>確認</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.emptyBox}>
                <Text style={{color: '#999'}}>目前無待領取訂單</Text>
              </View>
            )}
          </View>

          {/* 右側：掃描區 */}
          <View style={styles.scanSection}>
            <Text style={styles.scanTitle}>快速掃描</Text>
            <Text style={styles.scanSubTitle}>掃描顧客 QR Code</Text>
            <View style={styles.qrPlaceholder}>
              <Text style={{fontSize: 40, color:'#555'}}>回</Text>
              <Text style={styles.scanStatusText}>等待中...</Text>
            </View>
          </View>

        </View>

        {/* 底部數據概覽 (可選增加) */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📊 本週營運指標</Text>
          <Text style={styles.summaryValue}>已挽救 42 份剩餘物資</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FCF8EC' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    backgroundColor: '#FFF', 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { fontSize: 24, marginRight: 8 },
  logoText: { fontSize: 20, fontWeight: 'bold', color: '#3D5A45' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  tag: { backgroundColor: '#3D5A45', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginRight: 15 },
  tagText: { fontSize: 10, color: '#FFF', fontWeight: 'bold' },
  logoutBtn: { padding: 5 },
  logoutBtnText: { fontSize: 14, color: '#666' },

  container: { padding: 20 },
  titleSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 },
  shopName: { fontSize: 28, fontWeight: 'bold', color: '#3D5A45' },
  subText: { color: '#888', fontSize: 13, marginTop: 4 },
  addItemBtn: { backgroundColor: '#3D5A45', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12 },
  addItemText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },

  welcomeBanner: { backgroundColor: '#2A332C', padding: 12, borderRadius: 20, alignItems: 'center', marginBottom: 25 },
  bannerText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  mainContent: { flexDirection: 'row', gap: 15 },
  orderSection: { flex: 2, backgroundColor: '#FFF', borderRadius: 25, padding: 20, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#3D5A45' },
  orderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F4', padding: 12, borderRadius: 15, marginBottom: 12 },
  orderIdBox: { width: 35, height: 35, borderRadius: 8, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  orderIdText: { fontWeight: 'bold', color: '#3D5A45', fontSize: 12 },
  orderInfo: { flex: 1 },
  customerName: { fontSize: 14, fontWeight: 'bold' },
  orderDetail: { fontSize: 11, color: '#666' },
  orderTime: { fontSize: 10, color: '#AAA', marginTop: 2 },
  confirmBtn: { backgroundColor: '#3D5A45', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  confirmBtnText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  emptyBox: { alignItems: 'center', padding: 20 },

  scanSection: { flex: 1.1, backgroundColor: '#2A332C', borderRadius: 25, padding: 15, alignItems: 'center' },
  scanTitle: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  scanSubTitle: { color: '#666', fontSize: 10, marginTop: 4, marginBottom: 15, textAlign: 'center' },
  qrPlaceholder: { width: '100%', aspectRatio: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: '#444', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  scanStatusText: { color: '#666', marginTop: 10, fontSize: 10 },

  summaryCard: { backgroundColor: '#FFF', marginTop: 25, padding: 20, borderRadius: 25, elevation: 1 },
  summaryTitle: { fontSize: 14, fontWeight: 'bold', color: '#3D5A45', marginBottom: 5 },
  summaryValue: { fontSize: 16, color: '#666' }
});

export default MerchantView;