import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, ScrollView, 
  TouchableOpacity, SafeAreaView, TextInput, Alert 
} from 'react-native';

const MerchantView = ({ onLogout }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 控制是否顯示後台內容
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([
    { id: '21', customer: '林小姐', items: '歐式酸種麵包', price: 88, time: '10 mins ago' },
    { id: '25', customer: '張先生', items: '手工草莓塔', price: 120, time: '25 mins ago' },
  ]);

  // 🛰️ 店家登入邏輯
  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("提醒", "請填寫店家帳密");

    try {
      const response = await fetch('http://10.0.0.117/ReBite/server/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (result.status === "success") {
        if (result.role === 'merchant') {
          setIsLoggedIn(true);
        } else {
          Alert.alert("拒絕存取", "此帳號不具備店家權限");
        }
      } else {
        Alert.alert("失敗", result.message);
      }
    } catch (error) {
      Alert.alert("錯誤", "無法連線至伺服器");
    }
  };

  const confirmPickup = (id) => {
    Alert.alert("完成", `訂單 #${id} 已完成取貨！`);
    setOrders(orders.filter(order => order.id !== id));
  };

  // ---------------------------------------------------------
  // 1. 店家登入介面 (尚未登入時顯示)
  // ---------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.loginOverlay}>
        <View style={styles.loginCard}>
          <Text style={styles.loginTitle}>商家管理系統</Text>
          <Text style={styles.loginSub}>請輸入管理端核發之帳號</Text>
          
          <TextInput 
            style={styles.merchantInput} 
            placeholder="店家帳號 (Email)" 
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput 
            style={styles.merchantInput} 
            placeholder="管理密碼" 
            secureTextEntry 
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginBtnText}>驗證並進入系統</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onLogout} style={{marginTop: 20}}>
            <Text style={{color: '#888'}}>返回顧客介面</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ---------------------------------------------------------
  // 2. 原始店家管理介面 (登入成功後顯示)
  // ---------------------------------------------------------
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Text style={styles.logoIcon}>🍃</Text>
          <Text style={styles.logoText}>ReBite</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.tag}><Text style={styles.tagText}>MERCHANT TERMINAL</Text></View>
          <TouchableOpacity onPress={onLogout}><Text style={styles.logoutIcon}>🚪</Text></TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.shopName}>Green Bakery</Text>
            <Text style={styles.subText}>今日已達成 $2,480 惜食交易</Text>
          </View>
          <TouchableOpacity style={styles.addItemBtn}>
            <Text style={styles.addItemText}>＋ 新增剩餘品項</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.welcomeBanner}>
          <Text style={styles.bannerText}>⚡ 歡迎回來，MERCHANT 夥伴</Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.orderSection}>
            <Text style={styles.sectionTitle}>🕒 待領取訂單</Text>
            {orders.map(order => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderIdBox}><Text style={styles.orderIdText}>{order.id}</Text></View>
                <View style={styles.orderInfo}>
                  <Text style={styles.customerName}>{order.customer}</Text>
                  <Text style={styles.orderDetail}>{order.items} • $ {order.price} • {order.time}</Text>
                </View>
                <TouchableOpacity style={styles.confirmBtn} onPress={() => confirmPickup(order.id)}>
                  <Text style={styles.confirmBtnText}>確認取貨</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.scanSection}>
            <Text style={styles.scanTitle}>快速掃描</Text>
            <Text style={styles.scanSubTitle}>直接掃描顧客的手機 QR Code</Text>
            <View style={styles.qrPlaceholder}>
              <Text style={{fontSize: 50, color:'#444'}}>回</Text>
              <Text style={styles.scanStatusText}>等待掃描中...</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // 新增的登入樣式
  loginOverlay: { flex: 1, backgroundColor: '#2A332C', justifyContent: 'center', alignItems: 'center' },
  loginCard: { backgroundColor: '#FFF', width: '85%', padding: 30, borderRadius: 30, alignItems: 'center' },
  loginTitle: { fontSize: 24, fontWeight: 'bold', color: '#3D5A45', marginBottom: 10 },
  loginSub: { fontSize: 14, color: '#AAA', marginBottom: 25 },
  merchantInput: { backgroundColor: '#F9F9F4', width: '100%', height: 55, borderRadius: 15, paddingHorizontal: 20, marginBottom: 15, fontSize: 16 },
  loginBtn: { backgroundColor: '#3D5A45', width: '100%', height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  loginBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  // 原有的樣式 (保持不變)
  safeArea: { flex: 1, backgroundColor: '#F9F9F4' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#FFF', alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { fontSize: 24, marginRight: 8 },
  logoText: { fontSize: 20, fontWeight: 'bold', color: '#3D5A45' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  tag: { backgroundColor: '#F0F2F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagText: { fontSize: 10, color: '#3D5A45', fontWeight: 'bold' },
  logoutIcon: { fontSize: 20 },
  container: { padding: 25 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  shopName: { fontSize: 32, fontWeight: 'bold', color: '#3D5A45' },
  subText: { color: '#999', fontSize: 14 },
  addItemBtn: { backgroundColor: '#3D5A45', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  addItemText: { color: '#FFF', fontWeight: 'bold' },
  welcomeBanner: { backgroundColor: '#2A332C', padding: 15, borderRadius: 30, alignSelf: 'center', marginBottom: 30, paddingHorizontal: 40 },
  bannerText: { color: '#FFF', fontWeight: 'bold' },
  mainContent: { flexDirection: 'row', justifyContent: 'space-between' },
  orderSection: { width: '60%', backgroundColor: '#FFF', borderRadius: 25, padding: 25, elevation: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  orderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F4', padding: 15, borderRadius: 15, marginBottom: 15 },
  orderIdBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  orderIdText: { fontWeight: 'bold', color: '#3D5A45' },
  orderInfo: { flex: 1 },
  customerName: { fontSize: 16, fontWeight: 'bold' },
  orderDetail: { fontSize: 12, color: '#999', marginTop: 4 },
  confirmBtn: { backgroundColor: '#3D5A45', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  confirmBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  scanSection: { width: '35%', backgroundColor: '#2A332C', borderRadius: 25, padding: 25, alignItems: 'center' },
  scanTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  scanSubTitle: { color: '#666', fontSize: 12, marginTop: 5, marginBottom: 20 },
  qrPlaceholder: { width: '100%', aspectRatio: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: '#444', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  scanStatusText: { color: '#666', marginTop: 20, fontSize: 12 }
});

export default MerchantView;