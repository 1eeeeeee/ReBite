import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  TextInput, SafeAreaView, KeyboardAvoidingView, Platform, Alert, Image, Dimensions 
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';

// 引入你的 View 元件
import UserView from './src/UserView';
import MerchantView from './src/MerchantView';
import AdminView from './src/AdminView';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [role, setRole] = useState('visitor'); 
  const [isLogin, setIsLogin] = useState(true); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 判斷是否為 Web 環境
  const isWeb = Platform.OS === 'web';

  const validateEmail = (text) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
  const isPasswordValid = (pass) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(pass);

  const onPlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setShowSplash(false);
    }
  };

  // 🔐 核心驗證：平台與角色分流
  const handleAuth = () => {
    if (!email || !password) return Alert.alert("提醒", "請填寫完整資訊");
    const lowerEmail = email.toLowerCase();

    if (isLogin) {
      // --- 1. Admin 驗證 (僅限 Web) ---
      if (lowerEmail === 'admin@test.com' && password === '12345678a') {
        if (isWeb) {
          setRole('admin');
        } else {
          Alert.alert("存取受限", "管理後台僅限電腦網頁版使用 💻");
        }
        return;
      }

      // --- 2. User & Merchant 驗證 (僅限手機) ---
      if (
        (lowerEmail === 'user@test.com' || lowerEmail === 'merchant@test.com') && 
        password === '12345678a'
      ) {
        if (!isWeb) {
          setRole(lowerEmail.includes('user') ? 'user' : 'merchant');
        } else {
          // 電腦登入 User/Merchant 的攔截
          Alert.alert(
            "📱 請使用手機登入", 
            "一般用戶與商家功能僅限手機 App 使用。\n\n電腦網頁版目前僅開放管理員後台。"
          );
        }
        return;
      }

      Alert.alert("失敗", "帳號或密碼錯誤\n(測試密碼: 12345678a)");
    } else {
      // 註冊邏輯
      if (!isPasswordValid(password)) return Alert.alert("格式錯誤", "密碼需為 8-16 位英數字混合");
      if (password !== confirmPassword) return Alert.alert("驗證失敗", "兩次密碼不一致");
      
      Alert.alert("註冊成功", "帳號已建立，請登入 user@test.com 測試", [
        { text: "確定", onPress: () => { setIsLogin(true); setPassword(''); setConfirmPassword(''); }}
      ]);
    }
  };

  const renderContent = () => {
    if (role === 'user') return <UserView onLogout={() => setRole('visitor')} />;
    if (role === 'merchant') return <MerchantView onLogout={() => setRole('visitor')} />;
    if (role === 'admin') return <AdminView onLogout={() => setRole('visitor')} />;

    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.loginContainer}
      >
        {/* ✨ Logo 區塊 */}
        <View style={styles.logoSection}>
          <Text style={styles.logoTitle}>ReBite</Text>
          <View style={styles.logoIconBg}>
            <Image 
              source={require('./assets/images/logo.png')} 
              style={styles.logoImage}
            />
          </View>
          <Text style={styles.logoSubtitle}>每一口都在拯救地球</Text>
        </View>

        {/* 響應式卡片：Web 端會限制 maxWidth */}
        <View style={[styles.loginCard, isWeb && styles.webCard]}>
          <View style={styles.tabRow}>
            <TouchableOpacity 
              style={[styles.tab, isLogin && styles.activeTab]} 
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.tabText, isLogin && styles.activeTabText]}>登入</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, !isLogin && styles.activeTab]} 
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>註冊</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.inputLabel}>電子郵件</Text>
            <TextInput 
              style={styles.input} 
              placeholder="example@mail.com" 
              placeholderTextColor="#CCC" 
              value={email} 
              onChangeText={setEmail} 
              autoCapitalize="none" 
            />
            
            <Text style={styles.inputLabel}>密碼</Text>
            <TextInput 
              style={styles.input} 
              placeholder="請輸入密碼" 
              placeholderTextColor="#CCC" 
              secureTextEntry 
              value={password} 
              onChangeText={setPassword} 
            />

            {password.length > 0 && (
              <Text style={[styles.pwdHint, isPasswordValid(password) ? styles.validHint : styles.invalidHint]}>
                {isPasswordValid(password) ? '✓ 密碼格式正確' : '⚠ 需為 8-16 位英數字混合'}
              </Text>
            )}

            {!isLogin && (
              <View>
                <Text style={styles.inputLabel}>確認密碼</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="請再次輸入密碼" 
                  placeholderTextColor="#CCC" 
                  secureTextEntry 
                  value={confirmPassword} 
                  onChangeText={setConfirmPassword} 
                />
              </View>
            )}

            <TouchableOpacity style={styles.mainBtn} onPress={handleAuth}>
              <Text style={styles.mainBtnText}>{isLogin ? '登入' : '註冊'}</Text>
            </TouchableOpacity>

            {isWeb && (
              <View style={styles.webNotice}>
                <Text style={styles.webNoticeText}>* 網頁版僅限管理員(Admin)登入</Text>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };

  // Splash Screen 僅在手機端且非 Web 時顯示
  if (showSplash && !isWeb) {
    return (
      <View style={styles.splashContainer}>
        <Video
          source={require('./assets/images/logo.mp4')}
          style={{ width: width, height: height }}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping={false}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          onError={() => setShowSplash(false)}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FCF8EC' },
  splashContainer: { flex: 1, backgroundColor: '#FFF' },
  loginContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 25 },
  
  logoSection: { alignItems: 'center', marginBottom: 40 },
  logoTitle: { fontSize: 42, fontWeight: 'bold', color: '#3D5A45', letterSpacing: 2, marginBottom: 10 },
  logoIconBg: { width: 140, height: 110, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  logoImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  logoSubtitle: { fontSize: 16, color: '#888', letterSpacing: 1.5 },

  // 卡片與響應式佈局
  loginCard: { backgroundColor: '#FFF', width: '100%', borderRadius: 30, padding: 30, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  webCard: { maxWidth: 450 }, // 🖥️ Web 端限制寬度，避免卡片過寬

  tabRow: { flexDirection: 'row', marginBottom: 25, backgroundColor: '#F8F9FA', borderRadius: 15, padding: 5 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  activeTab: { backgroundColor: '#FFF', elevation: 2 },
  tabText: { color: '#AAA', fontWeight: '600' },
  activeTabText: { color: '#3D5A45' },
  
  form: { width: '100%' },
  inputLabel: { fontSize: 14, color: '#3D5A45', fontWeight: '600', marginBottom: 8, marginLeft: 5 },
  input: { backgroundColor: '#F8F9FA', height: 55, borderRadius: 15, paddingHorizontal: 20, marginBottom: 15, fontSize: 16 },
  pwdHint: { fontSize: 12, marginTop: -10, marginBottom: 15, marginLeft: 5 },
  invalidHint: { color: '#FF4D4D', fontWeight: 'bold' },
  validHint: { color: '#28A745' },
  mainBtn: { backgroundColor: '#3D5A45', height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  mainBtnText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },

  webNotice: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 15 },
  webNoticeText: { textAlign: 'center', color: '#AAA', fontSize: 12 }
});