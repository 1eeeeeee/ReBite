import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, ScrollView, 
  TouchableOpacity, SafeAreaView, TextInput, Alert 
} from 'react-native';

const AdminView = ({ onLogout }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 控管管理員是否已授權
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 🛡️ 管理員核身邏輯
  const handleAdminLogin = async () => {
    if (!email || !password) return Alert.alert("錯誤", "請輸入管理員憑證");

    try {
      const response = await fetch('http://10.0.0.117/ReBite/server/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (result.status === "success") {
        if (result.role === 'admin') {
          setIsLoggedIn(true);
        } else {
          Alert.alert("存取拒絕", "此帳號不具備系統管理員權限");
        }
      } else {
        Alert.alert("失敗", "帳號或密碼錯誤");
      }
    } catch (error) {
      Alert.alert("連線失敗", "無法連接至管理伺服器");
    }
  };

  // ---------------------------------------------------------
  // 1. 管理員授權畫面 (未登入時顯示)
  // ---------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.adminLockBg}>
        <View style={styles.lockCard}>
          <Text style={styles.lockIcon}>🛡️</Text>
          <Text style={styles.adminTitle}>ReBite Admin</Text>
          <Text style={styles.adminSub}>系統管理中心 (開發者專用)</Text>

          <TextInput 
            style={styles.adminInput} 
            placeholder="管理員信箱" 
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput 
            style={styles.adminInput} 
            placeholder="安全授權密碼" 
            placeholderTextColor="#666"
            secureTextEntry 
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.authBtn} onPress={handleAdminLogin}>
            <Text style={styles.authBtnText}>驗證身份</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onLogout} style={{marginTop: 30}}>
            <Text style={{color: '#888', textDecorationLine: 'underline'}}>退出管理模式</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ---------------------------------------------------------
  // 2. 原始管理後台介面 (登入成功後顯示)
  // ---------------------------------------------------------
  const stats = [
    { label: '合作店家', value: '128', unit: '家' },
    { label: '註冊用戶', value: '1,540', unit: '人' },
    { label: '減碳總量', value: '342.5', unit: 'kg' },
  ];

  const shops = [
    { name: 'Green Bakery', location: '台北市信義區', joined: '2025/12/01' },
    { name: 'Pure Food', location: '台北市大安區', joined: '2025/12/15' },
    { name: '日和食堂', location: '新北市板橋區', joined: '2026/01/10' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Text style={styles.logoIcon}>🍃</Text>
          <Text style={styles.logoText}>ReBite Admin</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>系統登出</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.welcomeText}>⚡ 營運數據總覽</Text>

        <View style={styles.statsGrid}>
          {stats.map((item, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statLabel}>{item.label}</Text>
              <View style={styles.valueRow}>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statUnit}>{item.unit}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitleChart}>📈 月度減碳趨勢</Text>
          <View style={styles.chartPlaceholder}>
            {[40, 60, 45, 90, 75, 95].map((h, i) => (
              <View key={i} style={[styles.bar, { height: h }]} />
            ))}
          </View>
        </View>

        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitleDark}>🏪 合作店家管理</Text>
            <TouchableOpacity><Text style={styles.moreText}>查看全部 ❯</Text></TouchableOpacity>
          </View>
          {shops.map((shop, index) => (
            <View key={index} style={styles.listItem}>
              <View>
                <Text style={styles.shopName}>{shop.name}</Text>
                <Text style={styles.shopInfo}>{shop.location}</Text>
              </View>
              <Text style={styles.joinDate}>{shop.joined}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // --- 管理員鎖定畫面樣式 ---
  adminLockBg: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  lockCard: { width: '85%', alignItems: 'center' },
  lockIcon: { fontSize: 60, marginBottom: 20 },
  adminTitle: { fontSize: 26, fontWeight: 'bold', color: '#FFF', letterSpacing: 1 },
  adminSub: { fontSize: 14, color: '#555', marginBottom: 40, marginTop: 5 },
  adminInput: { backgroundColor: '#1E1E1E', width: '100%', height: 60, borderRadius: 15, paddingHorizontal: 20, marginBottom: 15, color: '#FFF', fontSize: 16, borderWidth: 1, borderColor: '#333' },
  authBtn: { backgroundColor: '#3D5A45', width: '100%', height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: '#3D5A45', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  authBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

  // --- 原始樣式修正與保持 ---
  safeArea: { flex: 1, backgroundColor: '#F9F9F4' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#FFF', alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { fontSize: 24, marginRight: 8 },
  logoText: { fontSize: 20, fontWeight: 'bold', color: '#3D5A45' },
  logoutBtn: { backgroundColor: '#F0F2F0', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  logoutText: { fontSize: 12, color: '#666', fontWeight: 'bold' },
  container: { padding: 25 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#3D5A45', marginBottom: 20 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { backgroundColor: '#FFF', width: '31%', padding: 15, borderRadius: 20, elevation: 2, alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#999', marginBottom: 5 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#3D5A45' },
  statUnit: { fontSize: 10, color: '#3D5A45', marginLeft: 2 },
  chartSection: { backgroundColor: '#3D5A45', borderRadius: 25, padding: 20, marginBottom: 25 },
  sectionTitleChart: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#FFF' },
  chartPlaceholder: { height: 120, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: 10 },
  bar: { width: 30, backgroundColor: '#A9C0B0', borderRadius: 5 },
  listSection: { backgroundColor: '#FFF', borderRadius: 25, padding: 20 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitleDark: { fontSize: 18, fontWeight: 'bold', color: '#3D5A45' },
  moreText: { color: '#999', fontSize: 12 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F2F0' },
  shopName: { fontSize: 16, fontWeight: 'bold', color: '#3D5A45' },
  shopInfo: { fontSize: 12, color: '#999', marginTop: 2 },
  joinDate: { fontSize: 12, color: '#CCC' }
});

export default AdminView;